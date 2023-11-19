import {SchemaTypes} from '@pothos/core';
import {GraphQLError} from 'graphql';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

export type DirectusFile = {
  id: string;
  title?: string;
  type: string;
  width?: number;
  height?: number;
  copyright?: string;
  filename_download: string;
};

type DirectusPixelImage = DirectusFile & {width: number; height: number};

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
        },
        resolve: (root, args) => {
          const uri = new URL(assetUri(root.id));

          if (args.height != null) {
            uri.searchParams.append('height', String(args.height));
          }
          if (args.width != null) {
            uri.searchParams.append('width', String(args.width));
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

      const [row] = await prismaClient.$queryRaw<
        [DirectusFile?]
      >`select * from "directus"."directus_files" where "id"=${id}::uuid`;

      if (row == null || !row.height || !row.width) {
        return null;
      }

      return row as DirectusPixelImage;
    },
  });
}

export function assetConnection<Types extends SchemaTypes>(
  t: PothosSchemaTypes.FieldBuilder<Types, {id: string}, 'Object'>,
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
      // @ts-ignore
      resolve: async (root, {before, after, first, last}) => {
        if (last != null || before != null) {
          throw new GraphQLError('Not implemented');
        }

        const limit = first ?? 20;

        const assets = await prismaClient.$queryRawUnsafe<[DirectusFile]>(
          `SELECT * ${from({
            connectionName,
            id: root.id,
            after,
          })} ORDER BY "filename_download" LIMIT ${limit + 1};`,
        );

        let hasNextPage = assets.length > limit;
        if (hasNextPage) {
          assets.pop();
        }

        return {
          pageInfo: {
            hasNextPage,
            hasPreviousPage: false, // TODO
            startCursor: assets[0]?.filename_download,
            endCursor: assets[assets.length - 1]?.filename_download,
          },
          id: root.id,
          edges: assets.map((node) => ({
            cursor: node.filename_download,
            node,
          })),
        };
      },
    },
    {
      fields: (t) => ({
        totalCount: t.field({
          type: 'Int',
          nullable: false,
          // @ts-ignore whatever
          resolve: async (root) => {
            const [{count}] = await prismaClient.$queryRawUnsafe<
              [{count: number}]
            >(
              `SELECT COUNT(*) ${from({
                connectionName,
                id: root.id,
              })};`,
            );
            return Number(count);
          },
        }),
      }),
    },
  );
}

function from({
  connectionName,
  id,
  after,
}: {
  connectionName: string;
  id: string;
  after?: string | null;
  first?: number;
}) {
  return ` FROM
    "directus"."${s(connectionName)}_files"
    JOIN "directus"."directus_files" ON "directus_files_id" = "directus"."directus_files"."id"
  WHERE
    "${s(connectionName)}_id" = '${s(id)}' AND "filename_download" > '${s(
      after,
    )}'
  `;
}

function assetUri(id: string): string {
  return `https://crew.kulturspektakel.de/assets/${id}`;
}

function s(s?: string | null) {
  if (s && !/^[\w\s\-.]+$/iu.test(s)) {
    throw new GraphQLError('Invalid input to SQL query');
  }
  return s ?? '';
}
