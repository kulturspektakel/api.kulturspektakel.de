import prismaClient from '../utils/prismaClient';
import express, {NextFunction, Request} from 'express';
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

router.useAsync('/', async function (req, res, next: NextFunction) {
  const authorization: string | undefined = req.headers['authorization'];
  const macAddress = req.headers['x-esp8266-sta-mac'];
  if (typeof macAddress === 'string' && macAddress.length === 17) {
    const id = macAddress.substr(9);
    // ESPhttpUpdate.setAuthorization prefixes auth header with "Basic " :-/
    const match = authorization?.match(/^(Basic )?Bearer (.+)$/);
    const signature = match && match.length > 2 ? match[2] : req.query['token'];
    if (signature === sha1(`${id}${env.CONTACTLESS_SALT}`)) {
      res.locals.id = id;
      const softwareVersion =
        req.headers['x-esp8266-version']?.toString() ?? undefined;
      res.locals.version = softwareVersion;
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

router.getAsync('/config', async (_req, res) => {
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
  async (req: Request<{}, any, Buffer>, res) => {
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
                order.cartItems
                  .filter(({product}) => product != undefined)
                  .map(({amount, product}) => ({
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

    return res.status(201).send('Created');
  },
);

router.getAsync('/update', async (req, res) => {
  const {version} = res.locals;
  if (version) {
    const versionNumber = parseInt(version, 10);
    if (Number.isSafeInteger(versionNumber) && versionNumber > 0) {
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

      if (latestVersion && latestVersion > versionNumber) {
        await new Promise((resolve, reject) =>
          res.download(join(dir, `${latestVersion}.bin`), (err) => {
            if (err) {
              return reject(err);
            }
            return resolve(undefined);
          }),
        );
        return;
      }
    }
  }

  res.status(304).send('Not Modified');
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

export default router;
