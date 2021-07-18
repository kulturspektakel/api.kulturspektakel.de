import prismaClient from '../utils/prismaClient';
import {crc32} from 'crc';
import {Express, Request, Response} from 'express';
import asciinize from '../utils/asciinize';
import {ConfigMessage, TransactionMessage} from '../proto';
import {createHash} from 'crypto';
import env from '../utils/env';
import {
  IConfigMessage,
  ITransactionMessage,
  TransactionMessage as TransactionMessageT,
} from '../../types/proto';
import {OrderPayment} from '@prisma/client';
import UnreachableCaseError from '../utils/UnreachableCaseError';

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
  throw res.status(401).send('Unauthorizeed');
}

function mapPayment(payment: TransactionMessageT.Payment): OrderPayment {
  switch (payment) {
    case TransactionMessageT.Payment.CASH:
      return OrderPayment.CASH;
    case TransactionMessageT.Payment.BON:
      return OrderPayment.BON;
    case TransactionMessageT.Payment.FREE_BAND:
      return OrderPayment.FREE_BAND;
    case TransactionMessageT.Payment.FREE_CREW:
      return OrderPayment.FREE_CREW;
    case TransactionMessageT.Payment.SUM_UP:
      return OrderPayment.SUM_UP;
    case TransactionMessageT.Payment.VOUCHER:
      return OrderPayment.VOUCHER;
    default:
      throw new UnreachableCaseError(payment);
  }
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

    const partialList: Omit<IConfigMessage, 'checksum'> = {
      name: asciinize(list.name, 16),
      listId: list.id,
      ...list.product.reduce<Partial<IConfigMessage>>(
        (acc, {name, price}, i) => ({
          ...acc,
          [`product${i + 1}`]: asciinize(name, 16),
          [`price${i + 1}`]: price,
        }),
        {},
      ),
    };

    const message = ConfigMessage.encode({
      ...partialList,
      checksum: crc32(JSON.stringify(partialList)),
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

      const message: ITransactionMessage = TransactionMessage.decode(buffer);

      await prismaClient.order.create({
        data: {
          deviceTime: new Date(message.deviceTime * 1000),
          tokens: message.deposit,
          clientId: message.id,
          payment: mapPayment(message.payment),
          items: {
            createMany: {
              data:
                message.cartItems?.map((c) => ({
                  listId: message.listId,
                  amount: 1,
                  name: c.product,
                  perUnitPrice: c.price,
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
      // return res.status(400).send('Bad Request');
    });
  });

  app.get('/\\$\\$\\$/update', (req, res) => {
    const {id, version} = auth(req, res);
    // TODO
    return res.status(204).send('No Content');
  });
}
