import {GraphQLError} from 'graphql';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import {
  Asset,
  directusAssetToPixelImage,
  DirectusFile,
  pixelImageField,
} from './Asset';

export default builder.prismaNode('Event', {
  id: {field: 'id'},
  fields: (t) => ({
    name: t.exposeString('name'),
    start: t.expose('start', {type: 'DateTime'}),
    end: t.expose('end', {type: 'DateTime'}),
    bandsPlaying: t.relatedConnection('BandPlaying', {
      cursor: 'id',
      edgesNullable: false,
      nullable: false,
      nodeNullable: false,
      query: () => ({
        orderBy: [
          {
            startTime: 'asc',
          },
          {
            area: {
              order: 'asc',
            },
          },
        ],
      }),
      totalCount: true,
    }),
    description: t.exposeString('description', {nullable: true}),
    bandApplicationStart: t.expose('bandApplicationStart', {
      type: 'DateTime',
      nullable: true,
    }),
    bandApplicationEnd: t.expose('bandApplicationEnd', {
      type: 'DateTime',
      nullable: true,
    }),
    djApplicationEnd: t.expose('djApplicationEnd', {
      type: 'DateTime',
      nullable: true,
    }),
    bandApplication: t.relation('bandApplication', {
      authScopes: {
        user: true,
      },
      query: () => ({
        orderBy: {
          createdAt: 'asc',
        },
      }),
    }),
    poster: pixelImageField(t as any, 'poster'),
    media: t.connection({
      type: Asset,
      args: {
        width: t.arg.int(),
        height: t.arg.int(),
      },
      resolve: async (root, {before, after, first = 20, last, ...args}) => {
        if (last != null || before != null) {
          throw new GraphQLError('Not implemented');
        }

        const assets = await prismaClient.$queryRaw<[DirectusFile]>`
        SELECT
          *
        FROM
          "directus"."Event_files"
          JOIN "directus"."directus_files" ON "directus_files_id" = "directus"."directus_files"."id"
        WHERE
          "Event_id" = ${
            root.id
          } AND "directus"."Event_files"."id" > ${parseInt(after ?? '-1')}
        ORDER BY
          "directus"."Event_files"."id"
        LIMIT ${first};`;

        return {
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: assets[0]?.id,
            endCursor: assets[assets.length - 1]?.id,
          },
          edges: assets.map((node) => ({
            cursor: node.id,
            node: directusAssetToPixelImage(node, args),
          })),
        };
      },
    }),
  }),
});
