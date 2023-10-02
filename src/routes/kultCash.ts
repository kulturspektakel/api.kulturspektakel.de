import prismaClient from '../utils/prismaClient';
import express, {NextFunction, Request} from 'express';
import {
  LogMessage,
  LogMessage_CardTransaction_TransactionType,
  LogMessage_Order_PaymentMethod,
} from '../proto/logmessage';
import {DeviceConfig} from '../proto/config';
import {
  OrderPayment,
  CardTransactionType,
  Prisma,
  ProductList,
} from '@prisma/client';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import {join} from 'path';
import fsNode, {existsSync} from 'fs';
import {homedir} from 'os';
import {getTimezoneOffset} from 'date-fns-tz';
import {subMilliseconds} from 'date-fns';
import {ApiError} from '../utils/errorReporting';
import {Router} from '@awaitjs/express';
import crc32 from 'crc-32';
import {ParsedToken} from './auth';
import {AllLists} from '../proto/configs';
import {Product} from '../proto/product';

const fs = fsNode.promises;
const router = Router({});

function getSoftwareVersion(req: Request) {
  return req.header('x-esp8266-version')?.toString() ?? undefined;
}

router.useAsync('/', async function (req, res, next: NextFunction) {
  if (req._parsedToken?.iss != 'device') {
    throw new ApiError(401, 'Unauthorized');
  }
  const id = req._parsedToken.deviceId;
  const softwareVersion = getSoftwareVersion(req);
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
  next();
});

type ParsedDeviceToken = Extract<ParsedToken, {iss: 'device'}>;

function getDeviceConfig(
  list: ProductList & {
    product: Array<{
      name: string;
      price: number;
    }>;
  },
) {
  const deviceConfig: DeviceConfig = {
    listId: list.id,
    name: list.name,
    products: list.product,
    checksum: 0,
  };

  deviceConfig.checksum = crc32.buf(DeviceConfig.encode(deviceConfig).finish());
  return deviceConfig;
}

const productListQuery = {
  product: {
    select: {
      name: true,
      price: true,
    },
    orderBy: {
      order: 'asc' as const,
    },
    take: 30,
  },
};

router.getAsync('/config', async (req, res) => {
  const {deviceId: id} = req._parsedToken as ParsedDeviceToken;
  const device = await prismaClient.device.findUnique({
    where: {
      id,
    },
    include: {
      productList: {
        include: productListQuery,
      },
    },
  });

  const list = device?.productList;
  if (!list) {
    res.status(204).send('No Content');
    return;
  }

  const deviceConfig = getDeviceConfig(list);
  const message = DeviceConfig.encode(deviceConfig).finish();
  res.setHeader('Content-Type', 'application/x-protobuf');
  res.send(message);
});

router.getAsync('/lists', async (req, res) => {
  const lists = await prismaClient.productList.findMany({
    where: {
      active: true,
    },
    include: productListQuery,
    orderBy: {
      id: 'asc',
    },
  });

  const allLists = {
    productList: lists.map(getDeviceConfig),
    checksum: 0,
  };
  allLists.checksum = crc32.buf(AllLists.encode(allLists).finish());

  if (req.headers['if-none-match'] === `"${allLists.checksum}"`) {
    res.status(304).send('Not Modified');
    return;
  }

  const message = AllLists.encode(allLists).finish();
  res.setHeader('Content-Type', 'application/x-protobuf');
  res.setHeader('ETag', `"${allLists.checksum}"`);
  res.send(message);
});

router.postAsync(
  '/log',
  // @ts-ignore postAsync is not typed correctly
  express.raw({
    type: () => true, // parse body without Content-Type header
  }),
  async (req: Request<{}, any, Buffer>, res) => {
    const {deviceId: id} = req._parsedToken as ParsedDeviceToken;

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
  const version = getSoftwareVersion(req);

  if (version != null) {
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
