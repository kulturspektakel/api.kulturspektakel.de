// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.0
// source: configs.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { DeviceConfig } from "./config";

export const protobufPackage = "";

export interface AllLists {
  productList: DeviceConfig[];
  checksum: number;
  versionNumber: number;
  timestamp: number;
  privilegeTokens: Uint8Array[];
}

function createBaseAllLists(): AllLists {
  return { productList: [], checksum: 0, versionNumber: 0, timestamp: 0, privilegeTokens: [] };
}

export const AllLists: MessageFns<AllLists> = {
  encode(message: AllLists, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.productList) {
      DeviceConfig.encode(v!, writer.uint32(10).fork()).join();
    }
    if (message.checksum !== 0) {
      writer.uint32(16).int32(message.checksum);
    }
    if (message.versionNumber !== 0) {
      writer.uint32(24).int32(message.versionNumber);
    }
    if (message.timestamp !== 0) {
      writer.uint32(32).int32(message.timestamp);
    }
    for (const v of message.privilegeTokens) {
      writer.uint32(42).bytes(v!);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AllLists {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllLists();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.productList.push(DeviceConfig.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.checksum = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.versionNumber = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.timestamp = reader.int32();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.privilegeTokens.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AllLists {
    return {
      productList: globalThis.Array.isArray(object?.productList)
        ? object.productList.map((e: any) => DeviceConfig.fromJSON(e))
        : [],
      checksum: isSet(object.checksum) ? globalThis.Number(object.checksum) : 0,
      versionNumber: isSet(object.versionNumber) ? globalThis.Number(object.versionNumber) : 0,
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      privilegeTokens: globalThis.Array.isArray(object?.privilegeTokens)
        ? object.privilegeTokens.map((e: any) => bytesFromBase64(e))
        : [],
    };
  },

  toJSON(message: AllLists): unknown {
    const obj: any = {};
    if (message.productList?.length) {
      obj.productList = message.productList.map((e) => DeviceConfig.toJSON(e));
    }
    if (message.checksum !== 0) {
      obj.checksum = Math.round(message.checksum);
    }
    if (message.versionNumber !== 0) {
      obj.versionNumber = Math.round(message.versionNumber);
    }
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.privilegeTokens?.length) {
      obj.privilegeTokens = message.privilegeTokens.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AllLists>, I>>(base?: I): AllLists {
    return AllLists.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AllLists>, I>>(object: I): AllLists {
    const message = createBaseAllLists();
    message.productList = object.productList?.map((e) => DeviceConfig.fromPartial(e)) || [];
    message.checksum = object.checksum ?? 0;
    message.versionNumber = object.versionNumber ?? 0;
    message.timestamp = object.timestamp ?? 0;
    message.privilegeTokens = object.privilegeTokens?.map((e) => e) || [];
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

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
