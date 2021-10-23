/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import {Product} from './product';

export const protobufPackage = '';

export interface DeviceConfig {
  name: string;
  listId: number;
  products: Product[];
}

const baseDeviceConfig: object = {name: '', listId: 0};

export const DeviceConfig = {
  encode(
    message: DeviceConfig,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.listId !== 0) {
      writer.uint32(16).int32(message.listId);
    }
    for (const v of message.products) {
      Product.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeviceConfig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {...baseDeviceConfig} as DeviceConfig;
    message.products = [];
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
          message.products.push(Product.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeviceConfig {
    const message = {...baseDeviceConfig} as DeviceConfig;
    message.products = [];
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
    if (object.products !== undefined && object.products !== null) {
      for (const e of object.products) {
        message.products.push(Product.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: DeviceConfig): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.listId !== undefined && (obj.listId = message.listId);
    if (message.products) {
      obj.products = message.products.map((e) =>
        e ? Product.toJSON(e) : undefined,
      );
    } else {
      obj.products = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<DeviceConfig>): DeviceConfig {
    const message = {...baseDeviceConfig} as DeviceConfig;
    message.products = [];
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
    if (object.products !== undefined && object.products !== null) {
      for (const e of object.products) {
        message.products.push(Product.fromPartial(e));
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
