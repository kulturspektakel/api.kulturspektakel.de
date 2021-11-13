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

const baseCardTransaction: object = {
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
  deviceTimeIsUtc: false,
};

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
      writer.uint32(32).uint32(message.deviceTime);
    }
    if (message.paymentMethod !== 0) {
      writer.uint32(40).int32(message.paymentMethod);
    }
    if (message.balanceBefore !== 0) {
      writer.uint32(48).uint32(message.balanceBefore);
    }
    if (message.balanceAfter !== 0) {
      writer.uint32(56).uint32(message.balanceAfter);
    }
    if (message.depositBefore !== 0) {
      writer.uint32(64).uint32(message.depositBefore);
    }
    if (message.depositAfter !== 0) {
      writer.uint32(72).uint32(message.depositAfter);
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CardTransaction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {...baseCardTransaction} as CardTransaction;
    message.cartItems = [];
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
          message.deviceTime = reader.uint32();
          break;
        case 5:
          message.paymentMethod = reader.int32() as any;
          break;
        case 6:
          message.balanceBefore = reader.uint32();
          break;
        case 7:
          message.balanceAfter = reader.uint32();
          break;
        case 8:
          message.depositBefore = reader.uint32();
          break;
        case 9:
          message.depositAfter = reader.uint32();
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CardTransaction {
    const message = {...baseCardTransaction} as CardTransaction;
    message.cartItems = [];
    if (object.deviceId !== undefined && object.deviceId !== null) {
      message.deviceId = String(object.deviceId);
    } else {
      message.deviceId = '';
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = String(object.clientId);
    } else {
      message.clientId = '';
    }
    if (
      object.transactionType !== undefined &&
      object.transactionType !== null
    ) {
      message.transactionType = cardTransaction_TransactionTypeFromJSON(
        object.transactionType,
      );
    } else {
      message.transactionType = 0;
    }
    if (object.deviceTime !== undefined && object.deviceTime !== null) {
      message.deviceTime = Number(object.deviceTime);
    } else {
      message.deviceTime = 0;
    }
    if (object.paymentMethod !== undefined && object.paymentMethod !== null) {
      message.paymentMethod = cardTransaction_PaymentMethodFromJSON(
        object.paymentMethod,
      );
    } else {
      message.paymentMethod = 0;
    }
    if (object.balanceBefore !== undefined && object.balanceBefore !== null) {
      message.balanceBefore = Number(object.balanceBefore);
    } else {
      message.balanceBefore = 0;
    }
    if (object.balanceAfter !== undefined && object.balanceAfter !== null) {
      message.balanceAfter = Number(object.balanceAfter);
    } else {
      message.balanceAfter = 0;
    }
    if (object.depositBefore !== undefined && object.depositBefore !== null) {
      message.depositBefore = Number(object.depositBefore);
    } else {
      message.depositBefore = 0;
    }
    if (object.depositAfter !== undefined && object.depositAfter !== null) {
      message.depositAfter = Number(object.depositAfter);
    } else {
      message.depositAfter = 0;
    }
    if (object.cardId !== undefined && object.cardId !== null) {
      message.cardId = String(object.cardId);
    } else {
      message.cardId = '';
    }
    if (object.listId !== undefined && object.listId !== null) {
      message.listId = Number(object.listId);
    } else {
      message.listId = undefined;
    }
    if (object.cartItems !== undefined && object.cartItems !== null) {
      for (const e of object.cartItems) {
        message.cartItems.push(CardTransaction_CartItem.fromJSON(e));
      }
    }
    if (
      object.deviceTimeIsUtc !== undefined &&
      object.deviceTimeIsUtc !== null
    ) {
      message.deviceTimeIsUtc = Boolean(object.deviceTimeIsUtc);
    } else {
      message.deviceTimeIsUtc = false;
    }
    return message;
  },

  toJSON(message: CardTransaction): unknown {
    const obj: any = {};
    message.deviceId !== undefined && (obj.deviceId = message.deviceId);
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.transactionType !== undefined &&
      (obj.transactionType = cardTransaction_TransactionTypeToJSON(
        message.transactionType,
      ));
    message.deviceTime !== undefined && (obj.deviceTime = message.deviceTime);
    message.paymentMethod !== undefined &&
      (obj.paymentMethod = cardTransaction_PaymentMethodToJSON(
        message.paymentMethod,
      ));
    message.balanceBefore !== undefined &&
      (obj.balanceBefore = message.balanceBefore);
    message.balanceAfter !== undefined &&
      (obj.balanceAfter = message.balanceAfter);
    message.depositBefore !== undefined &&
      (obj.depositBefore = message.depositBefore);
    message.depositAfter !== undefined &&
      (obj.depositAfter = message.depositAfter);
    message.cardId !== undefined && (obj.cardId = message.cardId);
    message.listId !== undefined && (obj.listId = message.listId);
    if (message.cartItems) {
      obj.cartItems = message.cartItems.map((e) =>
        e ? CardTransaction_CartItem.toJSON(e) : undefined,
      );
    } else {
      obj.cartItems = [];
    }
    message.deviceTimeIsUtc !== undefined &&
      (obj.deviceTimeIsUtc = message.deviceTimeIsUtc);
    return obj;
  },

  fromPartial(object: DeepPartial<CardTransaction>): CardTransaction {
    const message = {...baseCardTransaction} as CardTransaction;
    message.cartItems = [];
    if (object.deviceId !== undefined && object.deviceId !== null) {
      message.deviceId = object.deviceId;
    } else {
      message.deviceId = '';
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = object.clientId;
    } else {
      message.clientId = '';
    }
    if (
      object.transactionType !== undefined &&
      object.transactionType !== null
    ) {
      message.transactionType = object.transactionType;
    } else {
      message.transactionType = 0;
    }
    if (object.deviceTime !== undefined && object.deviceTime !== null) {
      message.deviceTime = object.deviceTime;
    } else {
      message.deviceTime = 0;
    }
    if (object.paymentMethod !== undefined && object.paymentMethod !== null) {
      message.paymentMethod = object.paymentMethod;
    } else {
      message.paymentMethod = 0;
    }
    if (object.balanceBefore !== undefined && object.balanceBefore !== null) {
      message.balanceBefore = object.balanceBefore;
    } else {
      message.balanceBefore = 0;
    }
    if (object.balanceAfter !== undefined && object.balanceAfter !== null) {
      message.balanceAfter = object.balanceAfter;
    } else {
      message.balanceAfter = 0;
    }
    if (object.depositBefore !== undefined && object.depositBefore !== null) {
      message.depositBefore = object.depositBefore;
    } else {
      message.depositBefore = 0;
    }
    if (object.depositAfter !== undefined && object.depositAfter !== null) {
      message.depositAfter = object.depositAfter;
    } else {
      message.depositAfter = 0;
    }
    if (object.cardId !== undefined && object.cardId !== null) {
      message.cardId = object.cardId;
    } else {
      message.cardId = '';
    }
    if (object.listId !== undefined && object.listId !== null) {
      message.listId = object.listId;
    } else {
      message.listId = undefined;
    }
    if (object.cartItems !== undefined && object.cartItems !== null) {
      for (const e of object.cartItems) {
        message.cartItems.push(CardTransaction_CartItem.fromPartial(e));
      }
    }
    if (
      object.deviceTimeIsUtc !== undefined &&
      object.deviceTimeIsUtc !== null
    ) {
      message.deviceTimeIsUtc = object.deviceTimeIsUtc;
    } else {
      message.deviceTimeIsUtc = false;
    }
    return message;
  },
};

const baseCardTransaction_CartItem: object = {amount: 0};

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
    const message = {
      ...baseCardTransaction_CartItem,
    } as CardTransaction_CartItem;
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
    const message = {
      ...baseCardTransaction_CartItem,
    } as CardTransaction_CartItem;
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount);
    } else {
      message.amount = 0;
    }
    if (object.product !== undefined && object.product !== null) {
      message.product = Product.fromJSON(object.product);
    } else {
      message.product = undefined;
    }
    return message;
  },

  toJSON(message: CardTransaction_CartItem): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.product !== undefined &&
      (obj.product = message.product
        ? Product.toJSON(message.product)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CardTransaction_CartItem>,
  ): CardTransaction_CartItem {
    const message = {
      ...baseCardTransaction_CartItem,
    } as CardTransaction_CartItem;
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = 0;
    }
    if (object.product !== undefined && object.product !== null) {
      message.product = Product.fromPartial(object.product);
    } else {
      message.product = undefined;
    }
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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
