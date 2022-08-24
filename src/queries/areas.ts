import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import Area from '../models/Area';

builder.queryField('areas', (t) =>
  t.prismaField({
    type: [Area],
    resolve: (query) =>
      prismaClient.area.findMany({
        ...query,
        orderBy: {
          order: 'asc',
        },
      }),
  }),
);
