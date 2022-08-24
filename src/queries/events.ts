import Event from '../models/Event';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('events', (t) =>
  t.prismaField({
    type: [Event],
    resolve: (query) =>
      prismaClient.event.findMany({
        ...query,
        orderBy: {
          start: 'desc',
        },
      }),
  }),
);
