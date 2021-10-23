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
import {OrderPayment, CardTransactionType} from '@prisma/client';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import {add} from 'date-fns';

const sha1 = (data: string) => createHash('sha1').update(data).digest('hex');

function auth(req: Request, res: Response): {id: string; version?: string} {
  const authorization: string | undefined = req.headers['authorization'];
  const macAddress = req.headers['x-esp8266-sta-mac'];
  if (typeof macAddress === 'string' && macAddress.length === 17) {
    const id = macAddress.substr(9);
    const match = authorization?.match(/^Bearer (.+)$/);
    const signature = match && match.length > 1 ? match[1] : req.query['token'];
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
      products: list.product.map(({name, price}) => ({name, price})),
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
        },
      });

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
