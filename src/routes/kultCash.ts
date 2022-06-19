import prismaClient from '../utils/prismaClient';
import express, {NextFunction, Request, Response} from 'express';
import {createHash} from 'crypto';
import env from '../utils/env';
import {
  LogMessage,
  LogMessage_CardTransaction_TransactionType,
  LogMessage_Order_PaymentMethod,
} from '../proto/logmessage';
import {DeviceConfig} from '../proto/config';
import {OrderPayment, CardTransactionType, Prisma} from '@prisma/client';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import {join} from 'path';
import fsNode, {existsSync} from 'fs';
import {homedir} from 'os';
import {getTimezoneOffset} from 'date-fns-tz';
import {subMilliseconds} from 'date-fns';
import {ApiError} from '../utils/errorReporting';
import {Router} from '@awaitjs/express';
import crc32 from 'crc-32';

const fs = fsNode.promises;

const sha1 = (data: string) => createHash('sha1').update(data).digest('hex');

const router = Router({});

type Res = Response<
  any,
  Record<'id', string> & Record<'version', number | undefined>
>;

router.useAsync('/', async function (req, res: Res, next: NextFunction) {
  const authorization: string | undefined = req.headers['authorization'];
  const macAddress = req.headers['x-esp8266-sta-mac'];
  if (typeof macAddress === 'string' && macAddress.length === 17) {
    const id = macAddress.substr(9);
    // ESPhttpUpdate.setAuthorization prefixes auth header with "Basic " :-/
    const match = authorization?.match(/^(Basic )?Bearer (.+)$/);
    const signature = match && match.length > 2 ? match[2] : req.query['token'];
    if (signature === sha1(`${id}${env.KULT_CASH_SALT}`)) {
      let version: number | undefined = parseInt(
        req.headers['x-esp8266-version']?.toString() ?? '',
        10,
      );
      if (!Number.isSafeInteger(version)) {
        version = undefined;
      }
      res.locals.id = id;
      res.locals.version = version;
      const softwareVersion = version ? String(version) : undefined;
      const lastSeen = new Date();

      await prismaClient.device.upsert({
        where: {
          id,
        },
        create: {
          id,
          lastSeen,
          softwareVersion,
          type: 'CONTACTLESS_TERMINAL',
        },
        update: {
          lastSeen,
          softwareVersion,
        },
      });

      return next();
    }
  }

  throw new ApiError(401, 'Unauthorized');
});

router.getAsync('/config', async (_req, res: Res) => {
  const {id} = res.locals;
  const device = await prismaClient.device.findUnique({
    where: {
      id,
    },
    include: {
      productList: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
            orderBy: {
              order: 'asc',
            },
            take: 30,
          },
        },
      },
    },
  });

  const list = device?.productList;
  if (!list) {
    res.status(204).send('No Content');
    return;
  }

  const deviceConfig: DeviceConfig = {
    listId: list.id,
    name: list.name,
    products: list.product,
    checksum: 0,
  };

  deviceConfig.checksum = crc32.buf(DeviceConfig.encode(deviceConfig).finish());
  const message = DeviceConfig.encode(deviceConfig).finish();
  res.setHeader('Content-Type', 'application/x-protobuf');
  res.send(message);
});

router.postAsync(
  '/log',
  // @ts-ignore postAsync is not typed correctly
  express.raw({
    type: () => true, // parse body without Content-Type header
  }),
  async (req: Request<{}, any, Buffer>, res: Res) => {
    const {id} = res.locals;
    let message: LogMessage;
    try {
      message = LogMessage.decode(req.body);
    } catch (e) {
      throw new ApiError(400, 'Bad Request', e as Error);
    }

    if (!message.deviceId || !message.clientId) {
      throw new ApiError(
        400,
        'Bad Request',
        new Error('Missing device/cliendID'),
      );
    }

    let deviceTime = new Date(message.deviceTime * 1000);
    if (!message.deviceTimeIsUtc) {
      deviceTime = subMilliseconds(
        deviceTime,
        getTimezoneOffset('Europe/Berlin', deviceTime),
      );
    }

    const {cardTransaction, order} = message;
    let cardTransactionClientId: string | null = null;
    if (cardTransaction) {
      try {
        const cardT = await prismaClient.cardTransaction.create({
          data: {
            clientId: message.clientId,
            deviceTime,
            device: {
              connectOrCreate: {
                create: {
                  id,
                  lastSeen: new Date(),
                  type: 'CONTACTLESS_TERMINAL',
                },
                where: {
                  id,
                },
              },
            },
            cardId: cardTransaction.cardId,
            depositBefore: cardTransaction.depositBefore,
            depositAfter: cardTransaction.depositAfter,
            balanceBefore: cardTransaction.balanceBefore,
            balanceAfter: cardTransaction.balanceAfter,
            transactionType: mapTransactionType(
              cardTransaction.transactionType,
            ),
            counter: cardTransaction.counter,
          },
        });
        cardTransactionClientId = cardT.clientId;
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          // client ID already exists
          throw new ApiError(409, 'Conflict');
        }
        throw e;
      }
    }

    if (order) {
      await prismaClient.order.create({
        data: {
          createdAt: deviceTime,
          deposit: cardTransaction
            ? cardTransaction.depositBefore - cardTransaction.depositAfter
            : 0,
          payment: mapPayment(order.paymentMethod),
          items: {
            createMany: {
              data:
                order.cartItems.map(({amount, product}) => ({
                  productListId: order.listId,
                  amount,
                  name: product!.name, // not sure why product is nullable
                  perUnitPrice: product!.price,
                })) ?? [],
            },
          },
          deviceId: message.deviceId, // made sure device exists earlier
          cardTransactionClientId,
        },
      });
    }

    // try {
    //   await postTransactionToSlack(message);
    // } catch (e) {
    //   console.error(e);
    // }

    return res.status(201).send('Created');
  },
);

router.getAsync('/update', async (req, res: Res) => {
  const noUpdate = () => {
    res.status(304).send('Not Modified');
  };
  const {version} = res.locals;
  if (!version || version < 1) {
    return noUpdate();
  }

  const dir = join(homedir(), 'contactless-firmware');
  if (!existsSync(dir)) {
    await fs.mkdir(dir);
  }

  const latestVersion = (await fs.readdir(dir))
    .map((i) => i.match(/^(\d+)\.bin$/)?.pop())
    .map((i) => (i ? parseInt(i, 10) : undefined))
    .filter((i): i is number => Number.isSafeInteger(i))
    .sort((a, b) => a - b)
    .pop();

  if (latestVersion && latestVersion > version) {
    return res.download(join(dir, `${latestVersion}.bin`));
  }

  return noUpdate();
});

function mapTransactionType(
  payment: LogMessage_CardTransaction_TransactionType,
): CardTransactionType {
  switch (payment) {
    case LogMessage_CardTransaction_TransactionType.CASHOUT:
      return CardTransactionType.Cashout;
    case LogMessage_CardTransaction_TransactionType.CHARGE:
      return CardTransactionType.Charge;
    case LogMessage_CardTransaction_TransactionType.TOP_UP:
      return CardTransactionType.TopUp;
    case LogMessage_CardTransaction_TransactionType.UNRECOGNIZED:
      throw new Error('Unrecognized TransactionType');
    default:
      throw new UnreachableCaseError(payment);
  }
}

function mapPayment(payment: LogMessage_Order_PaymentMethod): OrderPayment {
  switch (payment) {
    case LogMessage_Order_PaymentMethod.CASH:
      return OrderPayment.CASH;
    case LogMessage_Order_PaymentMethod.BON:
      return OrderPayment.BON;
    case LogMessage_Order_PaymentMethod.FREE_BAND:
      return OrderPayment.FREE_BAND;
    case LogMessage_Order_PaymentMethod.FREE_CREW:
      return OrderPayment.FREE_CREW;
    case LogMessage_Order_PaymentMethod.SUM_UP:
      return OrderPayment.SUM_UP;
    case LogMessage_Order_PaymentMethod.VOUCHER:
      return OrderPayment.VOUCHER;
    case LogMessage_Order_PaymentMethod.KULT_CARD:
      return OrderPayment.KULT_CARD;
    case LogMessage_Order_PaymentMethod.UNRECOGNIZED:
      throw new Error('Unrecognized PaymentMethod');
    default:
      throw new UnreachableCaseError(payment);
  }
}

/*
async function postTransactionToSlack(message: CardTransaction) {
  let list: ProductList | null = null;
  if (message.listId) {
    list = await prismaClient.productList.findUnique({
      where: {
        id: message.listId,
      },
    });
  }

  const total = (message.balanceBefore - message.balanceAfter) / 100;
  const totalAbsoluteStr = Math.abs(total).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

  const fields = message.cartItems
    .flatMap<any[]>(({product, amount}) => [
      {
        type: 'mrkdwn',
        text: `${amount}x ${product?.name}`,
      },
      {
        type: 'mrkdwn',
        text: ((product?.price ?? 0 * amount) / 100).toLocaleString('de-DE', {
          style: 'currency',
          currency: 'EUR',
        }),
      },
    ])
    .concat([
      message.depositAfter != message.depositBefore
        ? {
            type: 'mrkdwn',
            text:
              message.depositAfter > message.depositBefore
                ? `${message.depositAfter - message.depositBefore}x Pfand`
                : `${
                    message.depositBefore - message.depositAfter
                  }x Pfandrückgabe`,
          }
        : null,
      message.depositAfter != message.depositBefore
        ? {
            type: 'mrkdwn',
            text: (
              ((message.depositAfter - message.depositBefore) *
                config.depositValue) /
              100
            ).toLocaleString('de-DE', {
              style: 'currency',
              currency: 'EUR',
            }),
          }
        : null,
    ])
    .filter(Boolean);

  await sendMessage({
    channel: SlackChannel.dev,
    text: list
      ? `${list.emoji} ${list.name}: ${totalAbsoluteStr}`
      : `Neue Transaktion: ${totalAbsoluteStr}`,
    username: list?.name ?? 'Neue Transaktion',
    icon_emoji: `:${emoji.find(list?.emoji ?? '💳')?.key ?? 'credit_card'}:`,
    blocks: [
      fields.length > 0
        ? {
            type: 'section',
            fields,
          }
        : null,
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*${
              message.transactionType ===
              CardTransaction_TransactionType.CASHOUT
                ? 'Auszahlung'
                : fields.length > 0
                ? 'Summe'
                : total > 0
                ? 'Abbuchung'
                : 'Aufladung'
            }*`,
          },
          {
            type: 'mrkdwn',
            text: `*${totalAbsoluteStr}*`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Transaktion* ${message.clientId} · *Geräte-ID* ${message.deviceId} · *Karten-ID* ${message.cardId}`,
          },
        ],
      },
      {
        type: 'divider',
      },
    ].filter(Boolean),
  });
}
*/

export default router;
