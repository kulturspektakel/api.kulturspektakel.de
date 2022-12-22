/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Product } from "./product";

export const protobufPackage = "";

export interface DeviceConfig {
  name: string;
  listId: number;
  products: Product[];
  checksum: number;
}

function createBaseDeviceConfig(): DeviceConfig {
  return { name: "", listId: 0, products: [], checksum: 0 };
}

export const DeviceConfig = {
  encode(message: DeviceConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.listId !== 0) {
      writer.uint32(16).int32(message.listId);
    }
    for (const v of message.products) {
      Product.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.checksum !== 0) {
      writer.uint32(32).int32(message.checksum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeviceConfig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeviceConfig();
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
        case 4:
          message.checksum = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeviceConfig {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      listId: isSet(object.listId) ? Number(object.listId) : 0,
      products: Array.isArray(object?.products) ? object.products.map((e: any) => Product.fromJSON(e)) : [],
      checksum: isSet(object.checksum) ? Number(object.checksum) : 0,
    };
  },

  toJSON(message: DeviceConfig): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.listId !== undefined && (obj.listId = Math.round(message.listId));
    if (message.products) {
      obj.products = message.products.map((e) => e ? Product.toJSON(e) : undefined);
    } else {
      obj.products = [];
    }
    message.checksum !== undefined && (obj.checksum = Math.round(message.checksum));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeviceConfig>, I>>(object: I): DeviceConfig {
    const message = createBaseDeviceConfig();
    message.name = object.name ?? "";
    message.listId = object.listId ?? 0;
    message.products = object.products?.map((e) => Product.fromPartial(e)) || [];
    message.checksum = object.checksum ?? 0;
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
