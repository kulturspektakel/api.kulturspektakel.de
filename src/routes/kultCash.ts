import prismaClient from '../utils/prismaClient';
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
import {getTimezoneOffset} from 'date-fns-tz';
import {subMilliseconds} from 'date-fns';
import {ApiError} from '../utils/errorReporting';
import crc32 from 'crc-32';
import {ParsedToken} from './auth';
import {AllLists} from '../proto/configs';
import {Hono, Context} from 'hono';

const app = new Hono();

function getSoftwareVersion(c: Context) {
  return c.req.header('x-esp8266-version')?.toString() ?? undefined;
}

app.use('/', async function (c) {
  const token = c.get('parsedToken');

  if (token?.iss != 'device') {
    throw new ApiError(401, 'Unauthorized');
  }
  const id = token.deviceId;
  const softwareVersion = getSoftwareVersion(c);
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

app.get('/config', async (c) => {
  const {deviceId: id} = c.get('parsedToken') as ParsedDeviceToken;
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
    return c.text('No Content', 204);
  }

  const deviceConfig = getDeviceConfig(list);
  const message = DeviceConfig.encode(deviceConfig).finish();
  c.header('Content-Type', 'application/x-protobuf');
  return c.body(message.buffer as ArrayBuffer);
});

app.get('/lists', async (c) => {
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

  if (c.req.header('if-none-match') === `"${allLists.checksum}"`) {
    return c.text('Not Modified', 304);
  }

  const message = AllLists.encode(allLists).finish();
  c.header('Content-Type', 'application/x-protobuf');
  c.header('ETag', `"${allLists.checksum}"`);
  return c.body(message.buffer as ArrayBuffer);
});

app.post('/log', async (c) => {
  const {deviceId: id} = c.get('parsedToken') as ParsedDeviceToken;

  let message: LogMessage;
  try {
    const body = await c.req.arrayBuffer();
    message = LogMessage.decode(new Uint8Array(body));
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
          transactionType: mapTransactionType(cardTransaction.transactionType),
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

  return c.text('Created', 201);
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

export default app;
