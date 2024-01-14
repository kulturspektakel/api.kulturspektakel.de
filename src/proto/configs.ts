/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { DeviceConfig } from "./config";

export const protobufPackage = "";

export interface AllLists {
  productList: DeviceConfig[];
  checksum: number;
}

function createBaseAllLists(): AllLists {
  return { productList: [], checksum: 0 };
}

export const AllLists = {
  encode(message: AllLists, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.productList) {
      DeviceConfig.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.checksum !== 0) {
      writer.uint32(16).int32(message.checksum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AllLists {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AllLists {
    return {
      productList: globalThis.Array.isArray(object?.productList)
        ? object.productList.map((e: any) => DeviceConfig.fromJSON(e))
        : [],
      checksum: isSet(object.checksum) ? globalThis.Number(object.checksum) : 0,
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
    return obj;
  },

  create<I extends Exact<DeepPartial<AllLists>, I>>(base?: I): AllLists {
    return AllLists.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AllLists>, I>>(object: I): AllLists {
    const message = createBaseAllLists();
    message.productList = object.productList?.map((e) => DeviceConfig.fromPartial(e)) || [];
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
