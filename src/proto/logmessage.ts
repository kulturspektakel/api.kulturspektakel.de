/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Product } from "./product";

export const protobufPackage = "";

export interface LogMessage {
  deviceId: string;
  clientId: string;
  deviceTime: number;
  deviceTimeIsUtc: boolean;
  order?: LogMessage_Order | undefined;
  cardTransaction?: LogMessage_CardTransaction | undefined;
}

export interface LogMessage_CardTransaction {
  transactionType: LogMessage_CardTransaction_TransactionType;
  balanceBefore: number;
  balanceAfter: number;
  depositBefore: number;
  depositAfter: number;
  cardId: string;
  counter?: number | undefined;
}

export enum LogMessage_CardTransaction_TransactionType {
  TOP_UP = 0,
  CHARGE = 1,
  CASHOUT = 2,
  UNRECOGNIZED = -1,
}

export function logMessage_CardTransaction_TransactionTypeFromJSON(
  object: any,
): LogMessage_CardTransaction_TransactionType {
  switch (object) {
    case 0:
    case "TOP_UP":
      return LogMessage_CardTransaction_TransactionType.TOP_UP;
    case 1:
    case "CHARGE":
      return LogMessage_CardTransaction_TransactionType.CHARGE;
    case 2:
    case "CASHOUT":
      return LogMessage_CardTransaction_TransactionType.CASHOUT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LogMessage_CardTransaction_TransactionType.UNRECOGNIZED;
  }
}

export function logMessage_CardTransaction_TransactionTypeToJSON(
  object: LogMessage_CardTransaction_TransactionType,
): string {
  switch (object) {
    case LogMessage_CardTransaction_TransactionType.TOP_UP:
      return "TOP_UP";
    case LogMessage_CardTransaction_TransactionType.CHARGE:
      return "CHARGE";
    case LogMessage_CardTransaction_TransactionType.CASHOUT:
      return "CASHOUT";
    case LogMessage_CardTransaction_TransactionType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface LogMessage_Order {
  paymentMethod: LogMessage_Order_PaymentMethod;
  cartItems: LogMessage_Order_CartItem[];
  listId?: number | undefined;
}

export enum LogMessage_Order_PaymentMethod {
  CASH = 0,
  BON = 1,
  SUM_UP = 2,
  VOUCHER = 3,
  FREE_CREW = 4,
  FREE_BAND = 5,
  KULT_CARD = 6,
  UNRECOGNIZED = -1,
}

export function logMessage_Order_PaymentMethodFromJSON(object: any): LogMessage_Order_PaymentMethod {
  switch (object) {
    case 0:
    case "CASH":
      return LogMessage_Order_PaymentMethod.CASH;
    case 1:
    case "BON":
      return LogMessage_Order_PaymentMethod.BON;
    case 2:
    case "SUM_UP":
      return LogMessage_Order_PaymentMethod.SUM_UP;
    case 3:
    case "VOUCHER":
      return LogMessage_Order_PaymentMethod.VOUCHER;
    case 4:
    case "FREE_CREW":
      return LogMessage_Order_PaymentMethod.FREE_CREW;
    case 5:
    case "FREE_BAND":
      return LogMessage_Order_PaymentMethod.FREE_BAND;
    case 6:
    case "KULT_CARD":
      return LogMessage_Order_PaymentMethod.KULT_CARD;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LogMessage_Order_PaymentMethod.UNRECOGNIZED;
  }
}

export function logMessage_Order_PaymentMethodToJSON(object: LogMessage_Order_PaymentMethod): string {
  switch (object) {
    case LogMessage_Order_PaymentMethod.CASH:
      return "CASH";
    case LogMessage_Order_PaymentMethod.BON:
      return "BON";
    case LogMessage_Order_PaymentMethod.SUM_UP:
      return "SUM_UP";
    case LogMessage_Order_PaymentMethod.VOUCHER:
      return "VOUCHER";
    case LogMessage_Order_PaymentMethod.FREE_CREW:
      return "FREE_CREW";
    case LogMessage_Order_PaymentMethod.FREE_BAND:
      return "FREE_BAND";
    case LogMessage_Order_PaymentMethod.KULT_CARD:
      return "KULT_CARD";
    case LogMessage_Order_PaymentMethod.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface LogMessage_Order_CartItem {
  amount: number;
  product: Product | undefined;
}

function createBaseLogMessage(): LogMessage {
  return {
    deviceId: "",
    clientId: "",
    deviceTime: 0,
    deviceTimeIsUtc: false,
    order: undefined,
    cardTransaction: undefined,
  };
}

export const LogMessage = {
  encode(message: LogMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.deviceId !== "") {
      writer.uint32(10).string(message.deviceId);
    }
    if (message.clientId !== "") {
      writer.uint32(18).string(message.clientId);
    }
    if (message.deviceTime !== 0) {
      writer.uint32(24).int32(message.deviceTime);
    }
    if (message.deviceTimeIsUtc === true) {
      writer.uint32(32).bool(message.deviceTimeIsUtc);
    }
    if (message.order !== undefined) {
      LogMessage_Order.encode(message.order, writer.uint32(42).fork()).ldelim();
    }
    if (message.cardTransaction !== undefined) {
      LogMessage_CardTransaction.encode(message.cardTransaction, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogMessage();
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
          message.deviceTime = reader.int32();
          break;
        case 4:
          message.deviceTimeIsUtc = reader.bool();
          break;
        case 5:
          message.order = LogMessage_Order.decode(reader, reader.uint32());
          break;
        case 6:
          message.cardTransaction = LogMessage_CardTransaction.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LogMessage {
    return {
      deviceId: isSet(object.deviceId) ? String(object.deviceId) : "",
      clientId: isSet(object.clientId) ? String(object.clientId) : "",
      deviceTime: isSet(object.deviceTime) ? Number(object.deviceTime) : 0,
      deviceTimeIsUtc: isSet(object.deviceTimeIsUtc) ? Boolean(object.deviceTimeIsUtc) : false,
      order: isSet(object.order) ? LogMessage_Order.fromJSON(object.order) : undefined,
      cardTransaction: isSet(object.cardTransaction)
        ? LogMessage_CardTransaction.fromJSON(object.cardTransaction)
        : undefined,
    };
  },

  toJSON(message: LogMessage): unknown {
    const obj: any = {};
    message.deviceId !== undefined && (obj.deviceId = message.deviceId);
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.deviceTime !== undefined && (obj.deviceTime = Math.round(message.deviceTime));
    message.deviceTimeIsUtc !== undefined && (obj.deviceTimeIsUtc = message.deviceTimeIsUtc);
    message.order !== undefined && (obj.order = message.order ? LogMessage_Order.toJSON(message.order) : undefined);
    message.cardTransaction !== undefined && (obj.cardTransaction = message.cardTransaction
      ? LogMessage_CardTransaction.toJSON(message.cardTransaction)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LogMessage>, I>>(object: I): LogMessage {
    const message = createBaseLogMessage();
    message.deviceId = object.deviceId ?? "";
    message.clientId = object.clientId ?? "";
    message.deviceTime = object.deviceTime ?? 0;
    message.deviceTimeIsUtc = object.deviceTimeIsUtc ?? false;
    message.order = (object.order !== undefined && object.order !== null)
      ? LogMessage_Order.fromPartial(object.order)
      : undefined;
    message.cardTransaction = (object.cardTransaction !== undefined && object.cardTransaction !== null)
      ? LogMessage_CardTransaction.fromPartial(object.cardTransaction)
      : undefined;
    return message;
  },
};

function createBaseLogMessage_CardTransaction(): LogMessage_CardTransaction {
  return {
    transactionType: 0,
    balanceBefore: 0,
    balanceAfter: 0,
    depositBefore: 0,
    depositAfter: 0,
    cardId: "",
    counter: undefined,
  };
}

export const LogMessage_CardTransaction = {
  encode(message: LogMessage_CardTransaction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionType !== 0) {
      writer.uint32(8).int32(message.transactionType);
    }
    if (message.balanceBefore !== 0) {
      writer.uint32(16).int32(message.balanceBefore);
    }
    if (message.balanceAfter !== 0) {
      writer.uint32(24).int32(message.balanceAfter);
    }
    if (message.depositBefore !== 0) {
      writer.uint32(32).int32(message.depositBefore);
    }
    if (message.depositAfter !== 0) {
      writer.uint32(40).int32(message.depositAfter);
    }
    if (message.cardId !== "") {
      writer.uint32(50).string(message.cardId);
    }
    if (message.counter !== undefined) {
      writer.uint32(56).int32(message.counter);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogMessage_CardTransaction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogMessage_CardTransaction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionType = reader.int32() as any;
          break;
        case 2:
          message.balanceBefore = reader.int32();
          break;
        case 3:
          message.balanceAfter = reader.int32();
          break;
        case 4:
          message.depositBefore = reader.int32();
          break;
        case 5:
          message.depositAfter = reader.int32();
          break;
        case 6:
          message.cardId = reader.string();
          break;
        case 7:
          message.counter = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LogMessage_CardTransaction {
    return {
      transactionType: isSet(object.transactionType)
        ? logMessage_CardTransaction_TransactionTypeFromJSON(object.transactionType)
        : 0,
      balanceBefore: isSet(object.balanceBefore) ? Number(object.balanceBefore) : 0,
      balanceAfter: isSet(object.balanceAfter) ? Number(object.balanceAfter) : 0,
      depositBefore: isSet(object.depositBefore) ? Number(object.depositBefore) : 0,
      depositAfter: isSet(object.depositAfter) ? Number(object.depositAfter) : 0,
      cardId: isSet(object.cardId) ? String(object.cardId) : "",
      counter: isSet(object.counter) ? Number(object.counter) : undefined,
    };
  },

  toJSON(message: LogMessage_CardTransaction): unknown {
    const obj: any = {};
    message.transactionType !== undefined &&
      (obj.transactionType = logMessage_CardTransaction_TransactionTypeToJSON(message.transactionType));
    message.balanceBefore !== undefined && (obj.balanceBefore = Math.round(message.balanceBefore));
    message.balanceAfter !== undefined && (obj.balanceAfter = Math.round(message.balanceAfter));
    message.depositBefore !== undefined && (obj.depositBefore = Math.round(message.depositBefore));
    message.depositAfter !== undefined && (obj.depositAfter = Math.round(message.depositAfter));
    message.cardId !== undefined && (obj.cardId = message.cardId);
    message.counter !== undefined && (obj.counter = Math.round(message.counter));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LogMessage_CardTransaction>, I>>(object: I): LogMessage_CardTransaction {
    const message = createBaseLogMessage_CardTransaction();
    message.transactionType = object.transactionType ?? 0;
    message.balanceBefore = object.balanceBefore ?? 0;
    message.balanceAfter = object.balanceAfter ?? 0;
    message.depositBefore = object.depositBefore ?? 0;
    message.depositAfter = object.depositAfter ?? 0;
    message.cardId = object.cardId ?? "";
    message.counter = object.counter ?? undefined;
    return message;
  },
};

function createBaseLogMessage_Order(): LogMessage_Order {
  return { paymentMethod: 0, cartItems: [], listId: undefined };
}

export const LogMessage_Order = {
  encode(message: LogMessage_Order, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.paymentMethod !== 0) {
      writer.uint32(8).int32(message.paymentMethod);
    }
    for (const v of message.cartItems) {
      LogMessage_Order_CartItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.listId !== undefined) {
      writer.uint32(24).int32(message.listId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogMessage_Order {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogMessage_Order();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.paymentMethod = reader.int32() as any;
          break;
        case 2:
          message.cartItems.push(LogMessage_Order_CartItem.decode(reader, reader.uint32()));
          break;
        case 3:
          message.listId = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LogMessage_Order {
    return {
      paymentMethod: isSet(object.paymentMethod) ? logMessage_Order_PaymentMethodFromJSON(object.paymentMethod) : 0,
      cartItems: Array.isArray(object?.cartItems)
        ? object.cartItems.map((e: any) => LogMessage_Order_CartItem.fromJSON(e))
        : [],
      listId: isSet(object.listId) ? Number(object.listId) : undefined,
    };
  },

  toJSON(message: LogMessage_Order): unknown {
    const obj: any = {};
    message.paymentMethod !== undefined &&
      (obj.paymentMethod = logMessage_Order_PaymentMethodToJSON(message.paymentMethod));
    if (message.cartItems) {
      obj.cartItems = message.cartItems.map((e) => e ? LogMessage_Order_CartItem.toJSON(e) : undefined);
    } else {
      obj.cartItems = [];
    }
    message.listId !== undefined && (obj.listId = Math.round(message.listId));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LogMessage_Order>, I>>(object: I): LogMessage_Order {
    const message = createBaseLogMessage_Order();
    message.paymentMethod = object.paymentMethod ?? 0;
    message.cartItems = object.cartItems?.map((e) => LogMessage_Order_CartItem.fromPartial(e)) || [];
    message.listId = object.listId ?? undefined;
    return message;
  },
};

function createBaseLogMessage_Order_CartItem(): LogMessage_Order_CartItem {
  return { amount: 0, product: undefined };
}

export const LogMessage_Order_CartItem = {
  encode(message: LogMessage_Order_CartItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.amount !== 0) {
      writer.uint32(8).int32(message.amount);
    }
    if (message.product !== undefined) {
      Product.encode(message.product, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogMessage_Order_CartItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogMessage_Order_CartItem();
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

  fromJSON(object: any): LogMessage_Order_CartItem {
    return {
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      product: isSet(object.product) ? Product.fromJSON(object.product) : undefined,
    };
  },

  toJSON(message: LogMessage_Order_CartItem): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    message.product !== undefined && (obj.product = message.product ? Product.toJSON(message.product) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LogMessage_Order_CartItem>, I>>(object: I): LogMessage_Order_CartItem {
    const message = createBaseLogMessage_Order_CartItem();
    message.amount = object.amount ?? 0;
    message.product = (object.product !== undefined && object.product !== null)
      ? Product.fromPartial(object.product)
      : undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
