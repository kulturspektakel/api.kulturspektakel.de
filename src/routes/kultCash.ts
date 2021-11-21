import prismaClient from '../utils/prismaClient';
import {Express, Request, Response} from 'express';
import {createHash} from 'crypto';
import env from '../utils/env';
import {
  CardTransaction,
  CardTransaction_PaymentMethod,
  CardTransaction_TransactionType,
} from '../proto/transaction';
import {DeviceConfig} from '../proto/config';
import {
  OrderPayment,
  CardTransactionType,
  Prisma,
  ProductList,
} from '@prisma/client';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import {add} from 'date-fns';
import {sendMessage, SlackChannel} from '../utils/slack';
import {config} from '../queries/config';
import emoji from 'node-emoji';

const sha1 = (data: string) => createHash('sha1').update(data).digest('hex');

function auth(req: Request, res: Response): {id: string; version?: string} {
  const authorization: string | undefined = req.headers['authorization'];
  const macAddress = req.headers['x-esp8266-sta-mac'];
  if (typeof macAddress === 'string' && macAddress.length === 17) {
    const id = macAddress.substr(9);
    // ESPhttpUpdate.setAuthorization prefixes auth header with "Basic " :-/
    const match = authorization?.match(/^(Basic )?Bearer (.+)$/);
    const signature = match && match.length > 2 ? match[2] : req.query['token'];
    if (signature === sha1(`${id}${env.KULT_CASH_SALT}`)) {
      return {id, version: req.headers['x-esp8266-version']?.toString()};
    }
  }
  throw res.status(401).send('Unauthorized');
}

export default function (app: Express) {
  app.get('/\\$\\$\\$/config', async (req, res) => {
    const {id} = auth(req, res);
    const device = await prismaClient.device.upsert({
      where: {
        id,
      },
      create: {
        id,
        lastSeen: new Date(),
      },
      update: {
        lastSeen: new Date(),
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
              take: 9,
            },
          },
        },
      },
    });

    const list = device?.productList;
    if (!list) {
      return res.status(204).send('No Content');
    }

    const message = DeviceConfig.encode({
      listId: list.id,
      name: list.name,
      products: list.product,
    }).finish();

    res.setHeader('Content-Type', 'application/x-protobuf');
    res.send(message);
  });

  app.post('/\\$\\$\\$/log', (req, res) => {
    let buffer: Buffer = Buffer.from('');
    req.on('data', (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
    });

    req.on('end', async () => {
      const {id} = auth(req, res);

      let message: CardTransaction;
      try {
        console.log(buffer.toString('base64'));
        message = CardTransaction.decode(buffer);
      } catch (e) {
        console.error(e);
        return res.status(400).send('Bad Request');
      }

      let deviceTime = new Date(message.deviceTime * 1000);
      if (!message.deviceTimeIsUtc) {
        const referenceDate = new Date();
        referenceDate.setMilliseconds(0);
        const shiftedDate = new Date(
          referenceDate.toLocaleString(undefined, {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          }),
        );
        const differenceMs = referenceDate.getTime() - shiftedDate.getTime();
        // TODO: Verify add or sub is needed here
        deviceTime = add(deviceTime, {
          minutes: differenceMs / 1000 / 60,
        });
      }

      try {
        await prismaClient.cardTransaction.create({
          data: {
            clientId: message.clientId,
            deviceTime,
            device: {
              connectOrCreate: {
                create: {
                  id,
                  lastSeen: new Date(),
                },
                where: {
                  id,
                },
              },
            },
            cardId: message.cardId,
            depositBefore: message.depositBefore,
            depositAfter: message.depositAfter,
            balanceBefore: message.balanceBefore,
            balanceAfter: message.balanceAfter,
            transactionType: mapTransactionType(message.transactionType),
          },
        });
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          // client ID already exists
          return res.status(409).send('Conflict');
        }
        throw e;
      }

      await prismaClient.order.create({
        data: {
          createdAt: deviceTime,
          deposit: message.depositBefore - message.depositAfter,
          payment: mapPayment(message.paymentMethod),
          items: {
            createMany: {
              data:
                message.cartItems?.map(({amount, product}) => ({
                  productListId: message.listId,
                  amount,
                  name: product!.name, // not sure why product is nullable
                  perUnitPrice: product!.price,
                })) ?? [],
            },
          },
          deviceId: message.deviceId, // made sure device exists earlier
          cardTransactionClientId: message.clientId,
        },
      });

      try {
        await postTransactionToSlack(message);
      } catch (e) {
        console.error(e);
      }

      return res.status(201).send('Created');
    });
  });

  app.get('/\\$\\$\\$/update', (req, res) => {
    const {id, version} = auth(req, res);
    // TODO
    return res.status(204).send('No Content');
  });
}

function mapTransactionType(
  payment: CardTransaction_TransactionType,
): CardTransactionType {
  switch (payment) {
    case CardTransaction_TransactionType.CASHOUT:
      return CardTransactionType.Cashout;
    case CardTransaction_TransactionType.CHARGE:
      return CardTransactionType.Charge;
    case CardTransaction_TransactionType.TOP_UP:
      return CardTransactionType.TopUp;
    case CardTransaction_TransactionType.UNRECOGNIZED:
      throw new Error('Unrecognized TransactionType');
    default:
      throw new UnreachableCaseError(payment);
  }
}

function mapPayment(payment: CardTransaction_PaymentMethod): OrderPayment {
  switch (payment) {
    case CardTransaction_PaymentMethod.CASH:
      return OrderPayment.CASH;
    case CardTransaction_PaymentMethod.BON:
      return OrderPayment.BON;
    case CardTransaction_PaymentMethod.FREE_BAND:
      return OrderPayment.FREE_BAND;
    case CardTransaction_PaymentMethod.FREE_CREW:
      return OrderPayment.FREE_CREW;
    case CardTransaction_PaymentMethod.SUM_UP:
      return OrderPayment.SUM_UP;
    case CardTransaction_PaymentMethod.VOUCHER:
      return OrderPayment.VOUCHER;
    case CardTransaction_PaymentMethod.KULT_CARD:
      return OrderPayment.KULT_CARD;
    case CardTransaction_PaymentMethod.UNRECOGNIZED:
      throw new Error('Unrecognized PaymentMethod');
    default:
      throw new UnreachableCaseError(payment);
  }
}

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
  const totalStr = total.toLocaleString('de-DE', {
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
      ? `${list.emoji} ${list.name}: ${totalStr}`
      : `Neue Transaktion: ${totalStr}`,
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
              fields.length > 0
                ? 'Summe'
                : total > 0
                ? 'Abbuchung'
                : 'Aufladung'
            }*`,
          },
          {
            type: 'mrkdwn',
            text: `*${totalStr}*`,
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
