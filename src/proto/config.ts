// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v3.19.4
// source: config.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
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

export const DeviceConfig: MessageFns<DeviceConfig> = {
  encode(message: DeviceConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.listId !== 0) {
      writer.uint32(16).int32(message.listId);
    }
    for (const v of message.products) {
      Product.encode(v!, writer.uint32(26).fork()).join();
    }
    if (message.checksum !== 0) {
      writer.uint32(32).int32(message.checksum);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DeviceConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeviceConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.listId = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.products.push(Product.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.checksum = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeviceConfig {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      listId: isSet(object.listId) ? globalThis.Number(object.listId) : 0,
      products: globalThis.Array.isArray(object?.products) ? object.products.map((e: any) => Product.fromJSON(e)) : [],
      checksum: isSet(object.checksum) ? globalThis.Number(object.checksum) : 0,
    };
  },

  toJSON(message: DeviceConfig): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.listId !== 0) {
      obj.listId = Math.round(message.listId);
    }
    if (message.products?.length) {
      obj.products = message.products.map((e) => Product.toJSON(e));
    }
    if (message.checksum !== 0) {
      obj.checksum = Math.round(message.checksum);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeviceConfig>, I>>(base?: I): DeviceConfig {
    return DeviceConfig.fromPartial(base ?? ({} as any));
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
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
