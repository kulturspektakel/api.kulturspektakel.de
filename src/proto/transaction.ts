/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import {Product} from './product';

export const protobufPackage = '';

export interface CardTransaction {
  deviceId: string;
  clientId: string;
  transactionType: CardTransaction_TransactionType;
  deviceTime: number;
  paymentMethod: CardTransaction_PaymentMethod;
  balanceBefore: number;
  balanceAfter: number;
  depositBefore: number;
  depositAfter: number;
  cardId: string;
  listId?: number | undefined;
  cartItems: CardTransaction_CartItem[];
  deviceTimeIsUtc: boolean;
  counter?: number | undefined;
}

export enum CardTransaction_PaymentMethod {
  CASH = 0,
  BON = 1,
  SUM_UP = 2,
  VOUCHER = 3,
  FREE_CREW = 4,
  FREE_BAND = 5,
  KULT_CARD = 6,
  UNRECOGNIZED = -1,
}

export function cardTransaction_PaymentMethodFromJSON(
  object: any,
): CardTransaction_PaymentMethod {
  switch (object) {
    case 0:
    case 'CASH':
      return CardTransaction_PaymentMethod.CASH;
    case 1:
    case 'BON':
      return CardTransaction_PaymentMethod.BON;
    case 2:
    case 'SUM_UP':
      return CardTransaction_PaymentMethod.SUM_UP;
    case 3:
    case 'VOUCHER':
      return CardTransaction_PaymentMethod.VOUCHER;
    case 4:
    case 'FREE_CREW':
      return CardTransaction_PaymentMethod.FREE_CREW;
    case 5:
    case 'FREE_BAND':
      return CardTransaction_PaymentMethod.FREE_BAND;
    case 6:
    case 'KULT_CARD':
      return CardTransaction_PaymentMethod.KULT_CARD;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return CardTransaction_PaymentMethod.UNRECOGNIZED;
  }
}

export function cardTransaction_PaymentMethodToJSON(
  object: CardTransaction_PaymentMethod,
): string {
  switch (object) {
    case CardTransaction_PaymentMethod.CASH:
      return 'CASH';
    case CardTransaction_PaymentMethod.BON:
      return 'BON';
    case CardTransaction_PaymentMethod.SUM_UP:
      return 'SUM_UP';
    case CardTransaction_PaymentMethod.VOUCHER:
      return 'VOUCHER';
    case CardTransaction_PaymentMethod.FREE_CREW:
      return 'FREE_CREW';
    case CardTransaction_PaymentMethod.FREE_BAND:
      return 'FREE_BAND';
    case CardTransaction_PaymentMethod.KULT_CARD:
      return 'KULT_CARD';
    default:
      return 'UNKNOWN';
  }
}

export enum CardTransaction_TransactionType {
  TOP_UP = 0,
  CHARGE = 1,
  CASHOUT = 2,
  UNRECOGNIZED = -1,
}

export function cardTransaction_TransactionTypeFromJSON(
  object: any,
): CardTransaction_TransactionType {
  switch (object) {
    case 0:
    case 'TOP_UP':
      return CardTransaction_TransactionType.TOP_UP;
    case 1:
    case 'CHARGE':
      return CardTransaction_TransactionType.CHARGE;
    case 2:
    case 'CASHOUT':
      return CardTransaction_TransactionType.CASHOUT;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return CardTransaction_TransactionType.UNRECOGNIZED;
  }
}

export function cardTransaction_TransactionTypeToJSON(
  object: CardTransaction_TransactionType,
): string {
  switch (object) {
    case CardTransaction_TransactionType.TOP_UP:
      return 'TOP_UP';
    case CardTransaction_TransactionType.CHARGE:
      return 'CHARGE';
    case CardTransaction_TransactionType.CASHOUT:
      return 'CASHOUT';
    default:
      return 'UNKNOWN';
  }
}

export interface CardTransaction_CartItem {
  amount: number;
  product: Product | undefined;
}

function createBaseCardTransaction(): CardTransaction {
  return {
    deviceId: '',
    clientId: '',
    transactionType: 0,
    deviceTime: 0,
    paymentMethod: 0,
    balanceBefore: 0,
    balanceAfter: 0,
    depositBefore: 0,
    depositAfter: 0,
    cardId: '',
    listId: undefined,
    cartItems: [],
    deviceTimeIsUtc: false,
    counter: undefined,
  };
}

export const CardTransaction = {
  encode(
    message: CardTransaction,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.deviceId !== '') {
      writer.uint32(10).string(message.deviceId);
    }
    if (message.clientId !== '') {
      writer.uint32(18).string(message.clientId);
    }
    if (message.transactionType !== 0) {
      writer.uint32(24).int32(message.transactionType);
    }
    if (message.deviceTime !== 0) {
      writer.uint32(32).int32(message.deviceTime);
    }
    if (message.paymentMethod !== 0) {
      writer.uint32(40).int32(message.paymentMethod);
    }
    if (message.balanceBefore !== 0) {
      writer.uint32(48).int32(message.balanceBefore);
    }
    if (message.balanceAfter !== 0) {
      writer.uint32(56).int32(message.balanceAfter);
    }
    if (message.depositBefore !== 0) {
      writer.uint32(64).int32(message.depositBefore);
    }
    if (message.depositAfter !== 0) {
      writer.uint32(72).int32(message.depositAfter);
    }
    if (message.cardId !== '') {
      writer.uint32(82).string(message.cardId);
    }
    if (message.listId !== undefined) {
      writer.uint32(88).int32(message.listId);
    }
    for (const v of message.cartItems) {
      CardTransaction_CartItem.encode(v!, writer.uint32(98).fork()).ldelim();
    }
    if (message.deviceTimeIsUtc === true) {
      writer.uint32(104).bool(message.deviceTimeIsUtc);
    }
    if (message.counter !== undefined) {
      writer.uint32(112).int32(message.counter);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CardTransaction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCardTransaction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deviceId = reader.string();
          break;
        case 2:
          message.clientId = reader.string();
          break;
        case 3:
          message.transactionType = reader.int32() as any;
          break;
        case 4:
          message.deviceTime = reader.int32();
          break;
        case 5:
          message.paymentMethod = reader.int32() as any;
          break;
        case 6:
          message.balanceBefore = reader.int32();
          break;
        case 7:
          message.balanceAfter = reader.int32();
          break;
        case 8:
          message.depositBefore = reader.int32();
          break;
        case 9:
          message.depositAfter = reader.int32();
          break;
        case 10:
          message.cardId = reader.string();
          break;
        case 11:
          message.listId = reader.int32();
          break;
        case 12:
          message.cartItems.push(
            CardTransaction_CartItem.decode(reader, reader.uint32()),
          );
          break;
        case 13:
          message.deviceTimeIsUtc = reader.bool();
          break;
        case 14:
          message.counter = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CardTransaction {
    return {
      deviceId: isSet(object.deviceId) ? String(object.deviceId) : '',
      clientId: isSet(object.clientId) ? String(object.clientId) : '',
      transactionType: isSet(object.transactionType)
        ? cardTransaction_TransactionTypeFromJSON(object.transactionType)
        : 0,
      deviceTime: isSet(object.deviceTime) ? Number(object.deviceTime) : 0,
      paymentMethod: isSet(object.paymentMethod)
        ? cardTransaction_PaymentMethodFromJSON(object.paymentMethod)
        : 0,
      balanceBefore: isSet(object.balanceBefore)
        ? Number(object.balanceBefore)
        : 0,
      balanceAfter: isSet(object.balanceAfter)
        ? Number(object.balanceAfter)
        : 0,
      depositBefore: isSet(object.depositBefore)
        ? Number(object.depositBefore)
        : 0,
      depositAfter: isSet(object.depositAfter)
        ? Number(object.depositAfter)
        : 0,
      cardId: isSet(object.cardId) ? String(object.cardId) : '',
      listId: isSet(object.listId) ? Number(object.listId) : undefined,
      cartItems: Array.isArray(object?.cartItems)
        ? object.cartItems.map((e: any) => CardTransaction_CartItem.fromJSON(e))
        : [],
      deviceTimeIsUtc: isSet(object.deviceTimeIsUtc)
        ? Boolean(object.deviceTimeIsUtc)
        : false,
      counter: isSet(object.counter) ? Number(object.counter) : undefined,
    };
  },

  toJSON(message: CardTransaction): unknown {
    const obj: any = {};
    message.deviceId !== undefined && (obj.deviceId = message.deviceId);
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.transactionType !== undefined &&
      (obj.transactionType = cardTransaction_TransactionTypeToJSON(
        message.transactionType,
      ));
    message.deviceTime !== undefined &&
      (obj.deviceTime = Math.round(message.deviceTime));
    message.paymentMethod !== undefined &&
      (obj.paymentMethod = cardTransaction_PaymentMethodToJSON(
        message.paymentMethod,
      ));
    message.balanceBefore !== undefined &&
      (obj.balanceBefore = Math.round(message.balanceBefore));
    message.balanceAfter !== undefined &&
      (obj.balanceAfter = Math.round(message.balanceAfter));
    message.depositBefore !== undefined &&
      (obj.depositBefore = Math.round(message.depositBefore));
    message.depositAfter !== undefined &&
      (obj.depositAfter = Math.round(message.depositAfter));
    message.cardId !== undefined && (obj.cardId = message.cardId);
    message.listId !== undefined && (obj.listId = Math.round(message.listId));
    if (message.cartItems) {
      obj.cartItems = message.cartItems.map((e) =>
        e ? CardTransaction_CartItem.toJSON(e) : undefined,
      );
    } else {
      obj.cartItems = [];
    }
    message.deviceTimeIsUtc !== undefined &&
      (obj.deviceTimeIsUtc = message.deviceTimeIsUtc);
    message.counter !== undefined &&
      (obj.counter = Math.round(message.counter));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CardTransaction>, I>>(
    object: I,
  ): CardTransaction {
    const message = createBaseCardTransaction();
    message.deviceId = object.deviceId ?? '';
    message.clientId = object.clientId ?? '';
    message.transactionType = object.transactionType ?? 0;
    message.deviceTime = object.deviceTime ?? 0;
    message.paymentMethod = object.paymentMethod ?? 0;
    message.balanceBefore = object.balanceBefore ?? 0;
    message.balanceAfter = object.balanceAfter ?? 0;
    message.depositBefore = object.depositBefore ?? 0;
    message.depositAfter = object.depositAfter ?? 0;
    message.cardId = object.cardId ?? '';
    message.listId = object.listId ?? undefined;
    message.cartItems =
      object.cartItems?.map((e) => CardTransaction_CartItem.fromPartial(e)) ||
      [];
    message.deviceTimeIsUtc = object.deviceTimeIsUtc ?? false;
    message.counter = object.counter ?? undefined;
    return message;
  },
};

function createBaseCardTransaction_CartItem(): CardTransaction_CartItem {
  return {amount: 0, product: undefined};
}

export const CardTransaction_CartItem = {
  encode(
    message: CardTransaction_CartItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.amount !== 0) {
      writer.uint32(8).int32(message.amount);
    }
    if (message.product !== undefined) {
      Product.encode(message.product, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CardTransaction_CartItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCardTransaction_CartItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.int32();
          break;
        case 2:
          message.product = Product.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CardTransaction_CartItem {
    return {
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      product: isSet(object.product)
        ? Product.fromJSON(object.product)
        : undefined,
    };
  },

  toJSON(message: CardTransaction_CartItem): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    message.product !== undefined &&
      (obj.product = message.product
        ? Product.toJSON(message.product)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CardTransaction_CartItem>, I>>(
    object: I,
  ): CardTransaction_CartItem {
    const message = createBaseCardTransaction_CartItem();
    message.amount = object.amount ?? 0;
    message.product =
      object.product !== undefined && object.product !== null
        ? Product.fromPartial(object.product)
        : undefined;
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? {[K in keyof T]?: DeepPartial<T[K]>}
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P &
      {[K in keyof P]: Exact<P[K], I[K]>} &
      Record<Exclude<keyof I, KeysOfUnion<P>>, never>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
