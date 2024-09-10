import {SchemaTypes} from '@pothos/core';
import {GraphQLError} from 'graphql';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import {getDirectusFileById} from '@prisma/client/sql';
import {resolveOffsetConnection} from '@pothos/plugin-relay';
import {
  PrismaModelTypes,
  PrismaObjectFieldBuilder,
} from '@pothos/plugin-prisma';

export type DirectusFile = {
  id: string;
  title?: string;
  type: string;
  width?: number;
  height?: number;
  copyright?: string;
  filename_download: string;
};

export type DirectusPixelImage = DirectusFile & {width: number; height: number};

const PIXEL_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);

export const Asset = builder.interfaceRef<DirectusFile>('Asset').implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    copyright: t.exposeString('copyright', {nullable: true}),
    uri: t.field({
      type: 'String',
      resolve: (root) => assetUri(root.id),
    }),
    title: t.exposeString('title', {nullable: true}),
    type: t.exposeString('type'),
  }),
  resolveType({type}) {
    return PIXEL_IMAGE_TYPES.has(type) ? 'PixelImage' : 'Asset';
  },
});

const DirectusPixelImageFormat = builder.enumType('DirectusPixelImageFormat', {
  // https://docs.directus.io/reference/files.html#custom-transformations
  values: ['auto', 'jpg', 'png', 'webp', 'tiff', 'original'] as const,
});

export const PixelImage = builder
  .objectRef<DirectusPixelImage>('PixelImage')
  .implement({
    interfaces: [Asset],
    fields: (t) => ({
      width: t.exposeInt('width'),
      height: t.exposeInt('height'),
      scaledUri: t.field({
        type: 'String',
        args: {
          width: t.arg.int(),
          height: t.arg.int(),
          format: t.arg({
            type: DirectusPixelImageFormat,
            defaultValue: 'auto',
          }),
        },
        resolve: (root, args) => {
          const uri = new URL(assetUri(root.id));

          if (args.height != null) {
            uri.searchParams.append('height', String(args.height));
          }
          if (args.width != null) {
            uri.searchParams.append('width', String(args.width));
          }
          if (args.format && args.format !== 'original') {
            uri.searchParams.append('format', args.format);
          }

          let width = root.width!;
          let height = root.height!;

          if (
            width != null &&
            height != null &&
            (args.width != null || args.height != null)
          ) {
            const aspectRatio = width / height;

            width = args.width!;
            height = args.height!;

            if (args.width == null) {
              width = Math.round(height! * aspectRatio);
            } else if (args.height == null) {
              height = Math.round(width! / aspectRatio);
            }
          }

          return uri.toString();
        },
      }),
    }),
  });

export function pixelImageField<Types extends SchemaTypes, F extends string>(
  t: PothosSchemaTypes.FieldBuilder<Types, {[K in F]: {url: string}}, 'Object'>,
  field: F,
) {
  return t.field({
    type: PixelImage,
    nullable: true,
    resolve: async (root) => {
      const id: string | undefined = (root as any)[field];
      if (id == null) {
        return null;
      }

      const [row] = await prismaClient.$queryRawTyped(getDirectusFileById(id));

      if (row == null || !row.height || !row.width) {
        return null;
      }

      return row as DirectusPixelImage;
    },
  });
}

export function assetConnection(
  t: PrismaObjectFieldBuilder<SchemaTypes, PrismaModelTypes & {id: string}>,
  connectionName: string,
) {
  return t.connection(
    {
      type: Asset,
      nodeNullable: false,
      edgesNullable: false,
      args: {
        width: t.arg.int(),
        height: t.arg.int(),
      },
      resolve: async (root, args) => {
        const [{count}] = await prismaClient.$queryRawUnsafe<[{count: number}]>(
          `SELECT COUNT(*) ${from(connectionName, root.id)};`,
        );

        return resolveOffsetConnection(
          {args, defaultSize: 20, totalCount: Number(count)},
          async ({limit, offset}) =>
            prismaClient.$queryRawUnsafe<[DirectusFile]>(
              `SELECT * ${from(connectionName, root.id)} ORDER BY "filename_download" LIMIT ${limit} OFFSET ${offset};`,
            ),
        );
      },
    },
    {
      fields: (t) => ({
        totalCount: t.field({
          type: 'Int',
          nullable: false,
          resolve: (root) => root.totalCount,
        }),
      }),
    },
  );
}

function from(connectionName: string, id: string) {
  return ` FROM
    "directus"."${s(connectionName)}_files"
    JOIN "directus"."directus_files" ON "directus_files_id" = "directus"."directus_files"."id"
    WHERE "${s(connectionName)}_id" = '${s(id)}'
  `;
}

export function assetUri(id: string): string {
  return `https://files.kulturspektakel.de/${id}`;
}

function s(s?: string | null) {
  if (s && !/^[\w\s\-.]+$/iu.test(s)) {
    throw new GraphQLError('Invalid input to SQL query');
  }
  return s ?? '';
}
