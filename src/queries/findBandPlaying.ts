import BandPlaying from '../models/BandPlaying';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('findBandPlaying', (t) =>
  t.field({
    type: [BandPlaying],
    nullable: false,
    args: {
      query: t.arg.string({required: true}),
      limit: t.arg.int(),
    },
    resolve: (_root, {query, limit}) => {
      if (!query) {
        return [];
      }
      return prismaClient.bandPlaying.findMany({
        where: {
          name: {
            search: `${query.trim().split(' ').join('<->')}:*`,
          },
        },
        take: limit ?? 10,
      });
    },
  }),
);
