/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';

export const protobufPackage = '';

export interface ConfigMessage {
  name: string;
  listId: number;
  product1?: string | undefined;
  price1?: number | undefined;
  product2?: string | undefined;
  price2?: number | undefined;
  product3?: string | undefined;
  price3?: number | undefined;
  product4?: string | undefined;
  price4?: number | undefined;
  product5?: string | undefined;
  price5?: number | undefined;
  product6?: string | undefined;
  price6?: number | undefined;
  product7?: string | undefined;
  price7?: number | undefined;
  product8?: string | undefined;
  price8?: number | undefined;
  product9?: string | undefined;
  price9?: number | undefined;
  checksum: number;
}

const baseConfigMessage: object = {name: '', listId: 0, checksum: 0};

export const ConfigMessage = {
  encode(
    message: ConfigMessage,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.listId !== 0) {
      writer.uint32(16).int32(message.listId);
    }
    if (message.product1 !== undefined) {
      writer.uint32(26).string(message.product1);
    }
    if (message.price1 !== undefined) {
      writer.uint32(32).int32(message.price1);
    }
    if (message.product2 !== undefined) {
      writer.uint32(42).string(message.product2);
    }
    if (message.price2 !== undefined) {
      writer.uint32(48).int32(message.price2);
    }
    if (message.product3 !== undefined) {
      writer.uint32(58).string(message.product3);
    }
    if (message.price3 !== undefined) {
      writer.uint32(64).int32(message.price3);
    }
    if (message.product4 !== undefined) {
      writer.uint32(74).string(message.product4);
    }
    if (message.price4 !== undefined) {
      writer.uint32(80).int32(message.price4);
    }
    if (message.product5 !== undefined) {
      writer.uint32(90).string(message.product5);
    }
    if (message.price5 !== undefined) {
      writer.uint32(96).int32(message.price5);
    }
    if (message.product6 !== undefined) {
      writer.uint32(106).string(message.product6);
    }
    if (message.price6 !== undefined) {
      writer.uint32(112).int32(message.price6);
    }
    if (message.product7 !== undefined) {
      writer.uint32(122).string(message.product7);
    }
    if (message.price7 !== undefined) {
      writer.uint32(128).int32(message.price7);
    }
    if (message.product8 !== undefined) {
      writer.uint32(138).string(message.product8);
    }
    if (message.price8 !== undefined) {
      writer.uint32(144).int32(message.price8);
    }
    if (message.product9 !== undefined) {
      writer.uint32(154).string(message.product9);
    }
    if (message.price9 !== undefined) {
      writer.uint32(160).int32(message.price9);
    }
    if (message.checksum !== 0) {
      writer.uint32(168).int32(message.checksum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfigMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {...baseConfigMessage} as ConfigMessage;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.listId = reader.int32();
          break;
        case 3:
          message.product1 = reader.string();
          break;
        case 4:
          message.price1 = reader.int32();
          break;
        case 5:
          message.product2 = reader.string();
          break;
        case 6:
          message.price2 = reader.int32();
          break;
        case 7:
          message.product3 = reader.string();
          break;
        case 8:
          message.price3 = reader.int32();
          break;
        case 9:
          message.product4 = reader.string();
          break;
        case 10:
          message.price4 = reader.int32();
          break;
        case 11:
          message.product5 = reader.string();
          break;
        case 12:
          message.price5 = reader.int32();
          break;
        case 13:
          message.product6 = reader.string();
          break;
        case 14:
          message.price6 = reader.int32();
          break;
        case 15:
          message.product7 = reader.string();
          break;
        case 16:
          message.price7 = reader.int32();
          break;
        case 17:
          message.product8 = reader.string();
          break;
        case 18:
          message.price8 = reader.int32();
          break;
        case 19:
          message.product9 = reader.string();
          break;
        case 20:
          message.price9 = reader.int32();
          break;
        case 21:
          message.checksum = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConfigMessage {
    const message = {...baseConfigMessage} as ConfigMessage;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.listId !== undefined && object.listId !== null) {
      message.listId = Number(object.listId);
    } else {
      message.listId = 0;
    }
    if (object.product1 !== undefined && object.product1 !== null) {
      message.product1 = String(object.product1);
    } else {
      message.product1 = undefined;
    }
    if (object.price1 !== undefined && object.price1 !== null) {
      message.price1 = Number(object.price1);
    } else {
      message.price1 = undefined;
    }
    if (object.product2 !== undefined && object.product2 !== null) {
      message.product2 = String(object.product2);
    } else {
      message.product2 = undefined;
    }
    if (object.price2 !== undefined && object.price2 !== null) {
      message.price2 = Number(object.price2);
    } else {
      message.price2 = undefined;
    }
    if (object.product3 !== undefined && object.product3 !== null) {
      message.product3 = String(object.product3);
    } else {
      message.product3 = undefined;
    }
    if (object.price3 !== undefined && object.price3 !== null) {
      message.price3 = Number(object.price3);
    } else {
      message.price3 = undefined;
    }
    if (object.product4 !== undefined && object.product4 !== null) {
      message.product4 = String(object.product4);
    } else {
      message.product4 = undefined;
    }
    if (object.price4 !== undefined && object.price4 !== null) {
      message.price4 = Number(object.price4);
    } else {
      message.price4 = undefined;
    }
    if (object.product5 !== undefined && object.product5 !== null) {
      message.product5 = String(object.product5);
    } else {
      message.product5 = undefined;
    }
    if (object.price5 !== undefined && object.price5 !== null) {
      message.price5 = Number(object.price5);
    } else {
      message.price5 = undefined;
    }
    if (object.product6 !== undefined && object.product6 !== null) {
      message.product6 = String(object.product6);
    } else {
      message.product6 = undefined;
    }
    if (object.price6 !== undefined && object.price6 !== null) {
      message.price6 = Number(object.price6);
    } else {
      message.price6 = undefined;
    }
    if (object.product7 !== undefined && object.product7 !== null) {
      message.product7 = String(object.product7);
    } else {
      message.product7 = undefined;
    }
    if (object.price7 !== undefined && object.price7 !== null) {
      message.price7 = Number(object.price7);
    } else {
      message.price7 = undefined;
    }
    if (object.product8 !== undefined && object.product8 !== null) {
      message.product8 = String(object.product8);
    } else {
      message.product8 = undefined;
    }
    if (object.price8 !== undefined && object.price8 !== null) {
      message.price8 = Number(object.price8);
    } else {
      message.price8 = undefined;
    }
    if (object.product9 !== undefined && object.product9 !== null) {
      message.product9 = String(object.product9);
    } else {
      message.product9 = undefined;
    }
    if (object.price9 !== undefined && object.price9 !== null) {
      message.price9 = Number(object.price9);
    } else {
      message.price9 = undefined;
    }
    if (object.checksum !== undefined && object.checksum !== null) {
      message.checksum = Number(object.checksum);
    } else {
      message.checksum = 0;
    }
    return message;
  },

  toJSON(message: ConfigMessage): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.listId !== undefined && (obj.listId = message.listId);
    message.product1 !== undefined && (obj.product1 = message.product1);
    message.price1 !== undefined && (obj.price1 = message.price1);
    message.product2 !== undefined && (obj.product2 = message.product2);
    message.price2 !== undefined && (obj.price2 = message.price2);
    message.product3 !== undefined && (obj.product3 = message.product3);
    message.price3 !== undefined && (obj.price3 = message.price3);
    message.product4 !== undefined && (obj.product4 = message.product4);
    message.price4 !== undefined && (obj.price4 = message.price4);
    message.product5 !== undefined && (obj.product5 = message.product5);
    message.price5 !== undefined && (obj.price5 = message.price5);
    message.product6 !== undefined && (obj.product6 = message.product6);
    message.price6 !== undefined && (obj.price6 = message.price6);
    message.product7 !== undefined && (obj.product7 = message.product7);
    message.price7 !== undefined && (obj.price7 = message.price7);
    message.product8 !== undefined && (obj.product8 = message.product8);
    message.price8 !== undefined && (obj.price8 = message.price8);
    message.product9 !== undefined && (obj.product9 = message.product9);
    message.price9 !== undefined && (obj.price9 = message.price9);
    message.checksum !== undefined && (obj.checksum = message.checksum);
    return obj;
  },

  fromPartial(object: DeepPartial<ConfigMessage>): ConfigMessage {
    const message = {...baseConfigMessage} as ConfigMessage;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.listId !== undefined && object.listId !== null) {
      message.listId = object.listId;
    } else {
      message.listId = 0;
    }
    if (object.product1 !== undefined && object.product1 !== null) {
      message.product1 = object.product1;
    } else {
      message.product1 = undefined;
    }
    if (object.price1 !== undefined && object.price1 !== null) {
      message.price1 = object.price1;
    } else {
      message.price1 = undefined;
    }
    if (object.product2 !== undefined && object.product2 !== null) {
      message.product2 = object.product2;
    } else {
      message.product2 = undefined;
    }
    if (object.price2 !== undefined && object.price2 !== null) {
      message.price2 = object.price2;
    } else {
      message.price2 = undefined;
    }
    if (object.product3 !== undefined && object.product3 !== null) {
      message.product3 = object.product3;
    } else {
      message.product3 = undefined;
    }
    if (object.price3 !== undefined && object.price3 !== null) {
      message.price3 = object.price3;
    } else {
      message.price3 = undefined;
    }
    if (object.product4 !== undefined && object.product4 !== null) {
      message.product4 = object.product4;
    } else {
      message.product4 = undefined;
    }
    if (object.price4 !== undefined && object.price4 !== null) {
      message.price4 = object.price4;
    } else {
      message.price4 = undefined;
    }
    if (object.product5 !== undefined && object.product5 !== null) {
      message.product5 = object.product5;
    } else {
      message.product5 = undefined;
    }
    if (object.price5 !== undefined && object.price5 !== null) {
      message.price5 = object.price5;
    } else {
      message.price5 = undefined;
    }
    if (object.product6 !== undefined && object.product6 !== null) {
      message.product6 = object.product6;
    } else {
      message.product6 = undefined;
    }
    if (object.price6 !== undefined && object.price6 !== null) {
      message.price6 = object.price6;
    } else {
      message.price6 = undefined;
    }
    if (object.product7 !== undefined && object.product7 !== null) {
      message.product7 = object.product7;
    } else {
      message.product7 = undefined;
    }
    if (object.price7 !== undefined && object.price7 !== null) {
      message.price7 = object.price7;
    } else {
      message.price7 = undefined;
    }
    if (object.product8 !== undefined && object.product8 !== null) {
      message.product8 = object.product8;
    } else {
      message.product8 = undefined;
    }
    if (object.price8 !== undefined && object.price8 !== null) {
      message.price8 = object.price8;
    } else {
      message.price8 = undefined;
    }
    if (object.product9 !== undefined && object.product9 !== null) {
      message.product9 = object.product9;
    } else {
      message.product9 = undefined;
    }
    if (object.price9 !== undefined && object.price9 !== null) {
      message.price9 = object.price9;
    } else {
      message.price9 = undefined;
    }
    if (object.checksum !== undefined && object.checksum !== null) {
      message.checksum = object.checksum;
    } else {
      message.checksum = 0;
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
