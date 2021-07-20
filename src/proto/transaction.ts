/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import {Timestamp} from './google/protobuf/timestamp';

export const protobufPackage = '';

export interface TransactionMessage {
  id: string;
  deviceId: string;
  mode: TransactionMessage_Mode;
  deviceTime: Date | undefined;
  card?: string | undefined;
  deposit: number;
  total: number;
  cartItems: TransactionMessage_CartItemMessage[];
  payment: TransactionMessage_Payment;
  listId?: number | undefined;
}

export enum TransactionMessage_Mode {
  TIME_ENTRY = 0,
  TOP_UP = 1,
  CHARGE = 2,
  CASHOUT = 3,
  INIT_CARD = 4,
  UNRECOGNIZED = -1,
}

export function transactionMessage_ModeFromJSON(
  object: any,
): TransactionMessage_Mode {
  switch (object) {
    case 0:
    case 'TIME_ENTRY':
      return TransactionMessage_Mode.TIME_ENTRY;
    case 1:
    case 'TOP_UP':
      return TransactionMessage_Mode.TOP_UP;
    case 2:
    case 'CHARGE':
      return TransactionMessage_Mode.CHARGE;
    case 3:
    case 'CASHOUT':
      return TransactionMessage_Mode.CASHOUT;
    case 4:
    case 'INIT_CARD':
      return TransactionMessage_Mode.INIT_CARD;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return TransactionMessage_Mode.UNRECOGNIZED;
  }
}

export function transactionMessage_ModeToJSON(
  object: TransactionMessage_Mode,
): string {
  switch (object) {
    case TransactionMessage_Mode.TIME_ENTRY:
      return 'TIME_ENTRY';
    case TransactionMessage_Mode.TOP_UP:
      return 'TOP_UP';
    case TransactionMessage_Mode.CHARGE:
      return 'CHARGE';
    case TransactionMessage_Mode.CASHOUT:
      return 'CASHOUT';
    case TransactionMessage_Mode.INIT_CARD:
      return 'INIT_CARD';
    default:
      return 'UNKNOWN';
  }
}

export enum TransactionMessage_Payment {
  CASH = 0,
  BON = 1,
  SUM_UP = 2,
  VOUCHER = 3,
  FREE_CREW = 4,
  FREE_BAND = 5,
  UNRECOGNIZED = -1,
}

export function transactionMessage_PaymentFromJSON(
  object: any,
): TransactionMessage_Payment {
  switch (object) {
    case 0:
    case 'CASH':
      return TransactionMessage_Payment.CASH;
    case 1:
    case 'BON':
      return TransactionMessage_Payment.BON;
    case 2:
    case 'SUM_UP':
      return TransactionMessage_Payment.SUM_UP;
    case 3:
    case 'VOUCHER':
      return TransactionMessage_Payment.VOUCHER;
    case 4:
    case 'FREE_CREW':
      return TransactionMessage_Payment.FREE_CREW;
    case 5:
    case 'FREE_BAND':
      return TransactionMessage_Payment.FREE_BAND;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return TransactionMessage_Payment.UNRECOGNIZED;
  }
}

export function transactionMessage_PaymentToJSON(
  object: TransactionMessage_Payment,
): string {
  switch (object) {
    case TransactionMessage_Payment.CASH:
      return 'CASH';
    case TransactionMessage_Payment.BON:
      return 'BON';
    case TransactionMessage_Payment.SUM_UP:
      return 'SUM_UP';
    case TransactionMessage_Payment.VOUCHER:
      return 'VOUCHER';
    case TransactionMessage_Payment.FREE_CREW:
      return 'FREE_CREW';
    case TransactionMessage_Payment.FREE_BAND:
      return 'FREE_BAND';
    default:
      return 'UNKNOWN';
  }
}

export interface TransactionMessage_CartItemMessage {
  price: number;
  product: string;
}

const baseTransactionMessage: object = {
  id: '',
  deviceId: '',
  mode: 0,
  deposit: 0,
  total: 0,
  payment: 0,
};

export const TransactionMessage = {
  encode(
    message: TransactionMessage,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id);
    }
    if (message.deviceId !== '') {
      writer.uint32(18).string(message.deviceId);
    }
    if (message.mode !== 0) {
      writer.uint32(24).int32(message.mode);
    }
    if (message.deviceTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deviceTime),
        writer.uint32(34).fork(),
      ).ldelim();
    }
    if (message.card !== undefined) {
      writer.uint32(42).string(message.card);
    }
    if (message.deposit !== 0) {
      writer.uint32(48).sint32(message.deposit);
    }
    if (message.total !== 0) {
      writer.uint32(56).sint32(message.total);
    }
    for (const v of message.cartItems) {
      TransactionMessage_CartItemMessage.encode(
        v!,
        writer.uint32(66).fork(),
      ).ldelim();
    }
    if (message.payment !== 0) {
      writer.uint32(72).int32(message.payment);
    }
    if (message.listId !== undefined) {
      writer.uint32(80).int32(message.listId);
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
          message.id = reader.string();
          break;
        case 2:
          message.deviceId = reader.string();
          break;
        case 3:
          message.mode = reader.int32() as any;
          break;
        case 4:
          message.deviceTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          break;
        case 5:
          message.card = reader.string();
          break;
        case 6:
          message.deposit = reader.sint32();
          break;
        case 7:
          message.total = reader.sint32();
          break;
        case 8:
          message.cartItems.push(
            TransactionMessage_CartItemMessage.decode(reader, reader.uint32()),
          );
          break;
        case 9:
          message.payment = reader.int32() as any;
          break;
        case 10:
          message.listId = reader.int32();
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
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.deviceId !== undefined && object.deviceId !== null) {
      message.deviceId = String(object.deviceId);
    } else {
      message.deviceId = '';
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = transactionMessage_ModeFromJSON(object.mode);
    } else {
      message.mode = 0;
    }
    if (object.deviceTime !== undefined && object.deviceTime !== null) {
      message.deviceTime = fromJsonTimestamp(object.deviceTime);
    } else {
      message.deviceTime = undefined;
    }
    if (object.card !== undefined && object.card !== null) {
      message.card = String(object.card);
    } else {
      message.card = undefined;
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
    if (object.cartItems !== undefined && object.cartItems !== null) {
      for (const e of object.cartItems) {
        message.cartItems.push(TransactionMessage_CartItemMessage.fromJSON(e));
      }
    }
    if (object.payment !== undefined && object.payment !== null) {
      message.payment = transactionMessage_PaymentFromJSON(object.payment);
    } else {
      message.payment = 0;
    }
    if (object.listId !== undefined && object.listId !== null) {
      message.listId = Number(object.listId);
    } else {
      message.listId = undefined;
    }
    return message;
  },

  toJSON(message: TransactionMessage): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.deviceId !== undefined && (obj.deviceId = message.deviceId);
    message.mode !== undefined &&
      (obj.mode = transactionMessage_ModeToJSON(message.mode));
    message.deviceTime !== undefined &&
      (obj.deviceTime = message.deviceTime.toISOString());
    message.card !== undefined && (obj.card = message.card);
    message.deposit !== undefined && (obj.deposit = message.deposit);
    message.total !== undefined && (obj.total = message.total);
    if (message.cartItems) {
      obj.cartItems = message.cartItems.map((e) =>
        e ? TransactionMessage_CartItemMessage.toJSON(e) : undefined,
      );
    } else {
      obj.cartItems = [];
    }
    message.payment !== undefined &&
      (obj.payment = transactionMessage_PaymentToJSON(message.payment));
    message.listId !== undefined && (obj.listId = message.listId);
    return obj;
  },

  fromPartial(object: DeepPartial<TransactionMessage>): TransactionMessage {
    const message = {...baseTransactionMessage} as TransactionMessage;
    message.cartItems = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.deviceId !== undefined && object.deviceId !== null) {
      message.deviceId = object.deviceId;
    } else {
      message.deviceId = '';
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = object.mode;
    } else {
      message.mode = 0;
    }
    if (object.deviceTime !== undefined && object.deviceTime !== null) {
      message.deviceTime = object.deviceTime;
    } else {
      message.deviceTime = undefined;
    }
    if (object.card !== undefined && object.card !== null) {
      message.card = object.card;
    } else {
      message.card = undefined;
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
    if (object.cartItems !== undefined && object.cartItems !== null) {
      for (const e of object.cartItems) {
        message.cartItems.push(
          TransactionMessage_CartItemMessage.fromPartial(e),
        );
      }
    }
    if (object.payment !== undefined && object.payment !== null) {
      message.payment = object.payment;
    } else {
      message.payment = 0;
    }
    if (object.listId !== undefined && object.listId !== null) {
      message.listId = object.listId;
    } else {
      message.listId = undefined;
    }
    return message;
  },
};

const baseTransactionMessage_CartItemMessage: object = {price: 0, product: ''};

export const TransactionMessage_CartItemMessage = {
  encode(
    message: TransactionMessage_CartItemMessage,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.price !== 0) {
      writer.uint32(8).int32(message.price);
    }
    if (message.product !== '') {
      writer.uint32(18).string(message.product);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): TransactionMessage_CartItemMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseTransactionMessage_CartItemMessage,
    } as TransactionMessage_CartItemMessage;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.price = reader.int32();
          break;
        case 2:
          message.product = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionMessage_CartItemMessage {
    const message = {
      ...baseTransactionMessage_CartItemMessage,
    } as TransactionMessage_CartItemMessage;
    if (object.price !== undefined && object.price !== null) {
      message.price = Number(object.price);
    } else {
      message.price = 0;
    }
    if (object.product !== undefined && object.product !== null) {
      message.product = String(object.product);
    } else {
      message.product = '';
    }
    return message;
  },

  toJSON(message: TransactionMessage_CartItemMessage): unknown {
    const obj: any = {};
    message.price !== undefined && (obj.price = message.price);
    message.product !== undefined && (obj.product = message.product);
    return obj;
  },

  fromPartial(
    object: DeepPartial<TransactionMessage_CartItemMessage>,
  ): TransactionMessage_CartItemMessage {
    const message = {
      ...baseTransactionMessage_CartItemMessage,
    } as TransactionMessage_CartItemMessage;
    if (object.price !== undefined && object.price !== null) {
      message.price = object.price;
    } else {
      message.price = 0;
    }
    if (object.product !== undefined && object.product !== null) {
      message.product = object.product;
    } else {
      message.product = '';
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

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return {seconds, nanos};
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === 'string') {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
