/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import {Product} from './product';

export const protobufPackage = '';

export interface TransactionMessage {
  deviceId: string;
  clientTransactionId: string;
  transactionType: TransactionMessage_TransactionType;
  deviceTime: number;
  paymentMethod: TransactionMessage_PaymentMethod;
  deposit: number;
  total: number;
  cardId?: string | undefined;
  listId?: number | undefined;
  cartItems: Product[];
}

export enum TransactionMessage_PaymentMethod {
  CASH = 0,
  BON = 1,
  SUM_UP = 2,
  VOUCHER = 3,
  FREE_CREW = 4,
  FREE_BAND = 5,
  KULT_CARD = 6,
  UNRECOGNIZED = -1,
}

export function transactionMessage_PaymentMethodFromJSON(
  object: any,
): TransactionMessage_PaymentMethod {
  switch (object) {
    case 0:
    case 'CASH':
      return TransactionMessage_PaymentMethod.CASH;
    case 1:
    case 'BON':
      return TransactionMessage_PaymentMethod.BON;
    case 2:
    case 'SUM_UP':
      return TransactionMessage_PaymentMethod.SUM_UP;
    case 3:
    case 'VOUCHER':
      return TransactionMessage_PaymentMethod.VOUCHER;
    case 4:
    case 'FREE_CREW':
      return TransactionMessage_PaymentMethod.FREE_CREW;
    case 5:
    case 'FREE_BAND':
      return TransactionMessage_PaymentMethod.FREE_BAND;
    case 6:
    case 'KULT_CARD':
      return TransactionMessage_PaymentMethod.KULT_CARD;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return TransactionMessage_PaymentMethod.UNRECOGNIZED;
  }
}

export function transactionMessage_PaymentMethodToJSON(
  object: TransactionMessage_PaymentMethod,
): string {
  switch (object) {
    case TransactionMessage_PaymentMethod.CASH:
      return 'CASH';
    case TransactionMessage_PaymentMethod.BON:
      return 'BON';
    case TransactionMessage_PaymentMethod.SUM_UP:
      return 'SUM_UP';
    case TransactionMessage_PaymentMethod.VOUCHER:
      return 'VOUCHER';
    case TransactionMessage_PaymentMethod.FREE_CREW:
      return 'FREE_CREW';
    case TransactionMessage_PaymentMethod.FREE_BAND:
      return 'FREE_BAND';
    case TransactionMessage_PaymentMethod.KULT_CARD:
      return 'KULT_CARD';
    default:
      return 'UNKNOWN';
  }
}

export enum TransactionMessage_TransactionType {
  TOP_UP = 0,
  CHARGE = 1,
  CASHOUT = 2,
  UNRECOGNIZED = -1,
}

export function transactionMessage_TransactionTypeFromJSON(
  object: any,
): TransactionMessage_TransactionType {
  switch (object) {
    case 0:
    case 'TOP_UP':
      return TransactionMessage_TransactionType.TOP_UP;
    case 1:
    case 'CHARGE':
      return TransactionMessage_TransactionType.CHARGE;
    case 2:
    case 'CASHOUT':
      return TransactionMessage_TransactionType.CASHOUT;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return TransactionMessage_TransactionType.UNRECOGNIZED;
  }
}

export function transactionMessage_TransactionTypeToJSON(
  object: TransactionMessage_TransactionType,
): string {
  switch (object) {
    case TransactionMessage_TransactionType.TOP_UP:
      return 'TOP_UP';
    case TransactionMessage_TransactionType.CHARGE:
      return 'CHARGE';
    case TransactionMessage_TransactionType.CASHOUT:
      return 'CASHOUT';
    default:
      return 'UNKNOWN';
  }
}

const baseTransactionMessage: object = {
  deviceId: '',
  clientTransactionId: '',
  transactionType: 0,
  deviceTime: 0,
  paymentMethod: 0,
  deposit: 0,
  total: 0,
};

export const TransactionMessage = {
  encode(
    message: TransactionMessage,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.deviceId !== '') {
      writer.uint32(10).string(message.deviceId);
    }
    if (message.clientTransactionId !== '') {
      writer.uint32(18).string(message.clientTransactionId);
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
    if (message.deposit !== 0) {
      writer.uint32(48).sint32(message.deposit);
    }
    if (message.total !== 0) {
      writer.uint32(56).sint32(message.total);
    }
    if (message.cardId !== undefined) {
      writer.uint32(66).string(message.cardId);
    }
    if (message.listId !== undefined) {
      writer.uint32(72).int32(message.listId);
    }
    for (const v of message.cartItems) {
      Product.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {...baseTransactionMessage} as TransactionMessage;
    message.cartItems = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deviceId = reader.string();
          break;
        case 2:
          message.clientTransactionId = reader.string();
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
          message.deposit = reader.sint32();
          break;
        case 7:
          message.total = reader.sint32();
          break;
        case 8:
          message.cardId = reader.string();
          break;
        case 9:
          message.listId = reader.int32();
          break;
        case 10:
          message.cartItems.push(Product.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionMessage {
    const message = {...baseTransactionMessage} as TransactionMessage;
    message.cartItems = [];
    if (object.deviceId !== undefined && object.deviceId !== null) {
      message.deviceId = String(object.deviceId);
    } else {
      message.deviceId = '';
    }
    if (
      object.clientTransactionId !== undefined &&
      object.clientTransactionId !== null
    ) {
      message.clientTransactionId = String(object.clientTransactionId);
    } else {
      message.clientTransactionId = '';
    }
    if (
      object.transactionType !== undefined &&
      object.transactionType !== null
    ) {
      message.transactionType = transactionMessage_TransactionTypeFromJSON(
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
      message.paymentMethod = transactionMessage_PaymentMethodFromJSON(
        object.paymentMethod,
      );
    } else {
      message.paymentMethod = 0;
    }
    if (object.deposit !== undefined && object.deposit !== null) {
      message.deposit = Number(object.deposit);
    } else {
      message.deposit = 0;
    }
    if (object.total !== undefined && object.total !== null) {
      message.total = Number(object.total);
    } else {
      message.total = 0;
    }
    if (object.cardId !== undefined && object.cardId !== null) {
      message.cardId = String(object.cardId);
    } else {
      message.cardId = undefined;
    }
    if (object.listId !== undefined && object.listId !== null) {
      message.listId = Number(object.listId);
    } else {
      message.listId = undefined;
    }
    if (object.cartItems !== undefined && object.cartItems !== null) {
      for (const e of object.cartItems) {
        message.cartItems.push(Product.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: TransactionMessage): unknown {
    const obj: any = {};
    message.deviceId !== undefined && (obj.deviceId = message.deviceId);
    message.clientTransactionId !== undefined &&
      (obj.clientTransactionId = message.clientTransactionId);
    message.transactionType !== undefined &&
      (obj.transactionType = transactionMessage_TransactionTypeToJSON(
        message.transactionType,
      ));
    message.deviceTime !== undefined && (obj.deviceTime = message.deviceTime);
    message.paymentMethod !== undefined &&
      (obj.paymentMethod = transactionMessage_PaymentMethodToJSON(
        message.paymentMethod,
      ));
    message.deposit !== undefined && (obj.deposit = message.deposit);
    message.total !== undefined && (obj.total = message.total);
    message.cardId !== undefined && (obj.cardId = message.cardId);
    message.listId !== undefined && (obj.listId = message.listId);
    if (message.cartItems) {
      obj.cartItems = message.cartItems.map((e) =>
        e ? Product.toJSON(e) : undefined,
      );
    } else {
      obj.cartItems = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TransactionMessage>): TransactionMessage {
    const message = {...baseTransactionMessage} as TransactionMessage;
    message.cartItems = [];
    if (object.deviceId !== undefined && object.deviceId !== null) {
      message.deviceId = object.deviceId;
    } else {
      message.deviceId = '';
    }
    if (
      object.clientTransactionId !== undefined &&
      object.clientTransactionId !== null
    ) {
      message.clientTransactionId = object.clientTransactionId;
    } else {
      message.clientTransactionId = '';
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
    if (object.deposit !== undefined && object.deposit !== null) {
      message.deposit = object.deposit;
    } else {
      message.deposit = 0;
    }
    if (object.total !== undefined && object.total !== null) {
      message.total = object.total;
    } else {
      message.total = 0;
    }
    if (object.cardId !== undefined && object.cardId !== null) {
      message.cardId = object.cardId;
    } else {
      message.cardId = undefined;
    }
    if (object.listId !== undefined && object.listId !== null) {
      message.listId = object.listId;
    } else {
      message.listId = undefined;
    }
    if (object.cartItems !== undefined && object.cartItems !== null) {
      for (const e of object.cartItems) {
        message.cartItems.push(Product.fromPartial(e));
      }
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
