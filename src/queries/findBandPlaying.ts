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

      query = query
        // sanitize tsquery: Only Letters, spaces, dash
        .replace(/[^\p{L}0-9- ]/g, ' ')
        // remove spaces in front and beginning
        .trim()
        // sanitize tsquery: Only Letters, spaces, dash
        .replace(/\s\s*/g, '<->');

      return prismaClient.bandPlaying.findMany({
        where: {
          name: {
            search: `${query}:*`,
          },
        },
        orderBy: {
          startTime: 'desc',
        },
        take: limit ?? 10,
      });
    },
  }),
);
