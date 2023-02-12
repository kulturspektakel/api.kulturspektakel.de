import Event from '../models/Event';
import EventType from '../models/EventType';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('events', (t) =>
  t.prismaField({
    type: [Event],
    args: {
      type: t.arg({
        type: EventType,
      }),
    },
    resolve: (query, _root, {type}) =>
      prismaClient.event.findMany({
        ...query,
        orderBy: {
          start: 'desc',
        },
        where: {
          eventType: type ?? undefined,
        },
      }),
  }),
);
