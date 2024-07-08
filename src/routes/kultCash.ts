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
  const userAgent = c.req.header('user-agent')?.split('/').pop();
  if (userAgent) {
    return userAgent;
  }
  return c.req.header('x-esp8266-version')?.toString() ?? undefined;
}

// https://github.com/honojs/hono/issues/2345
app.use('/:this_is_a_hono_bug', async function (c, next) {
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

  return next();
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

  const privilegeTokens = await prismaClient.devicePrivilegeToken.findMany({});

  const allLists: AllLists = {
    productList: lists.map(getDeviceConfig),
    privilegeTokens: privilegeTokens.map((t) => t.id),
    versionNumber: 0,
    timestamp: 0,
    checksum: 0,
  };
  allLists.checksum = crc32.buf(AllLists.encode(allLists).finish());
  const configVersion = await prismaClient.deviceConfigVersion.upsert({
    where: {
      crc32: allLists.checksum,
    },
    create: {
      crc32: allLists.checksum,
    },
    update: {},
  });
  allLists.versionNumber = configVersion.version;
  allLists.timestamp = Math.floor(configVersion.createdAt.getTime() / 1000);

  if (c.req.header('if-none-match') === `"${allLists.checksum}"`) {
    return c.text('Not Modified', 304);
  }

  const message = AllLists.encode(allLists).finish();
  c.header('Content-Type', 'application/x-protobuf');
  c.header('ETag', `"${allLists.checksum}"`);
  return c.body(message.buffer as ArrayBuffer);
});

app.post('/log', async (c) => {
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

  const {
    deviceTime: dt,
    deviceTimeIsUtc,
    deviceId,
    order,
    cardTransaction,
    ...data
  } = message;

  let deviceTime = new Date(dt * 1000);
  if (!deviceTimeIsUtc) {
    deviceTime = subMilliseconds(
      deviceTime,
      getTimezoneOffset('Europe/Berlin', deviceTime),
    );
  }

  const orderCreate =
    order != null
      ? {
          payment: mapPayment(order.paymentMethod),
          items: {
            createMany: {
              data: order.cartItems
                .filter(({product}) => product != undefined)
                .map(({amount, product}) => ({
                  amount,
                  name: product!.name,
                  perUnitPrice: product!.price,
                  productListId: order.listId,
                })),
            },
          },
        }
      : undefined;

  await prismaClient.deviceLog
    .create({
      data: {
        ...data,
        deviceTime,
        device: {
          connectOrCreate: {
            create: {
              id: deviceId,
              lastSeen: new Date(),
              type: 'CONTACTLESS_TERMINAL' as const,
            },
            where: {
              id: deviceId,
            },
          },
        },
        CardTransaction:
          cardTransaction != null
            ? {
                create: {
                  ...cardTransaction,
                  transactionType: mapTransactionType(
                    cardTransaction.transactionType,
                  ),
                  Order: order != null ? {create: orderCreate} : undefined,
                },
              }
            : undefined,
      },
    })
    .catch((e) => {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        // client ID already exists
        throw new ApiError(409, 'Conflict');
      }
      throw e;
    });

  if (!cardTransaction && orderCreate) {
    // manually create order, because it's not part of a card transaction
    await prismaClient.order.create({
      data: {
        ...orderCreate,
        deviceId,
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
