import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import {Asset, pixelImageField} from './Asset';

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
    // media: t.connection({
    //   type: Asset,
    //   resolve: async (root, {before, after, first, last}) => {
    //     const assets = await prismaClient.$queryRaw<
    //       [{}]
    //     >`select * from "directus"."Event_files" WHERE "Event_id"=${root.id}`;
    //     return {
    //       pageInfo: {
    //         hasNextPage: false,
    //         hasPreviousPage: false,
    //         startCursor: 'abc',
    //         endCursor: 'def',
    //       },
    //       edges: assets.map((asset) => ({
    //         cursor: 'abc',
    //         node: null,
    //       })),
    //     };
    //   },
    // }),
  }),
});
