import {SchemaTypes} from '@pothos/core';
import {PrismaObjectFieldBuilder} from '@pothos/plugin-prisma';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

enum PixelImageFormatT {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
}

const PixelImageFormat = builder.enumType(PixelImageFormatT, {
  name: 'PixelImageFormat',
});

export type AssetT = {
  id: string;
  uri: string;
  copyright?: string;
  title?: string;
  type: string;
};

export const Asset = builder.interfaceRef<AssetT>('Asset').implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    copyright: t.exposeString('copyright', {nullable: true}),
    uri: t.exposeString('uri'),
    title: t.exposeString('title', {nullable: true}),
    type: t.exposeString('type'),
  }),
  resolveType({type}) {
    for (const value of Object.values(PixelImageFormatT)) {
      if (value === type) {
        return 'PixelImage';
      }
    }
    return 'Asset';
  },
});

export const PixelImage = builder
  .objectRef<
    {
      width: number;
      height: number;
      format: PixelImageFormatT;
    } & AssetT
  >('PixelImage')
  .implement({
    interfaces: [Asset],
    fields: (t) => ({
      width: t.exposeInt('width'),
      height: t.exposeInt('height'),
      format: t.expose('format', {type: PixelImageFormat}),
    }),
  });

export function pixelImageField<Types extends SchemaTypes, F extends string>(
  t: PothosSchemaTypes.FieldBuilder<Types, {[K in F]: {url: string}}, 'Object'>,
  field: F,
) {
  return t.field({
    type: PixelImage,
    nullable: true,
    args: {
      width: t.arg.int(),
      height: t.arg.int(),
    },
    // @ts-ignore
    resolve: async (root, args) => {
      const id: string | undefined = (root as any)[field];
      if (id == null) {
        return null;
      }

      const [row] = await prismaClient.$queryRaw<
        [DirectusFile]
      >`select * from "directus"."directus_files" where "id"=${id}::uuid`;

      if (row == null) {
        return null;
      }

      return directusAssetToPixelImage(row, args);
    },
  });
}

export type DirectusFile = {
  id: string;
  title?: string;
  type: PixelImageFormatT;
  width?: number;
  height?: number;
  copyright?: string;
};

export function directusAssetToPixelImage(
  directusFile: DirectusFile,
  args: {
    width?: number | null;
    height?: number | null;
  },
) {
  const uri = new URL(
    `https://cms.kulturspektakel.de/assets/${directusFile.id}`,
  );

  if (args.height != null) {
    uri.searchParams.append('height', String(args.height));
  }
  if (args.width != null) {
    uri.searchParams.append('width', String(args.width));
  }

  let width = directusFile.width;
  let height = directusFile.height;

  if (
    width != null &&
    height != null &&
    (args.width != null || args.height != null)
  ) {
    const aspectRatio = width / height;

    width = args.width ?? undefined;
    height = args.height ?? undefined;

    if (args.width == null) {
      width = Math.round(height! * aspectRatio);
    } else if (args.height == null) {
      height = Math.round(width! / aspectRatio);
    }
  }

  return {
    ...directusFile,
    height,
    width,
    format: directusFile.type,
    uri: uri.toString(),
  };
}
