import prismaClient from '../utils/prismaClient';
import {Express, Request, Response} from 'express';
import asciinize from '../utils/asciinize';
import {createHash} from 'crypto';
import env from '../utils/env';
import {
  TransactionMessage,
  TransactionMessage_PaymentMethod,
} from '../proto/transaction';
import {ConfigMessage} from '../proto/config';
import {OrderPayment} from '@prisma/client';

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

    const message = ConfigMessage.encode({
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

      let message: TransactionMessage;
      try {
        message = TransactionMessage.decode(buffer);
      } catch (e) {
        console.error(e);
        return res.status(400).send('Bad Request');
      }

      await prismaClient.order.create({
        data: {
          deviceTime: new Date(message.deviceTime),
          tokens: message.deposit,
          clientId: message.clientTransactionId,
          payment: mapPayment(message.paymentMethod),
          items: {
            createMany: {
              data:
                message.cartItems?.map(({name, price}) => ({
                  productListId: message.listId,
                  amount: 1,
                  name: name,
                  perUnitPrice: price,
                })) ?? [],
            },
          },
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

function mapPayment(payment: TransactionMessage_PaymentMethod): OrderPayment {
  switch (payment) {
    case TransactionMessage_PaymentMethod.CASH:
      return OrderPayment.CASH;
    case TransactionMessage_PaymentMethod.BON:
      return OrderPayment.BON;
    case TransactionMessage_PaymentMethod.FREE_BAND:
      return OrderPayment.FREE_BAND;
    case TransactionMessage_PaymentMethod.FREE_CREW:
      return OrderPayment.FREE_CREW;
    case TransactionMessage_PaymentMethod.SUM_UP:
      return OrderPayment.SUM_UP;
    case TransactionMessage_PaymentMethod.VOUCHER:
      return OrderPayment.VOUCHER;
    default:
      return OrderPayment.CASH;
  }
}
