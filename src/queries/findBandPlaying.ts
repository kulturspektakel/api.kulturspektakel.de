import BandPlaying from '../models/BandPlaying';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('findBandPlaying', (t) =>
  t.field({
    type: [BandPlaying],
    nullable: false,
    args: {
      query: t.arg.string({required: true}),
    },
    resolve: (_root, {query}) =>
      prismaClient.bandPlaying.findMany({
        where: {
          name: {
            search: `${query.split(' ').join('<->')}:*`,
          },
        },
      }),
  }),
);
