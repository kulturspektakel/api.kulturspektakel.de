import Event from '../models/Event';
import EventType from '../models/EventType';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('events', (t) =>
  t.prismaField({
    type: [Event],
    deprecationReason: 'Use `eventsConnection` instead.',
    args: {
      type: t.arg({
        type: EventType,
      }),
      limit: t.arg.int(),
      hasBandsPlaying: t.arg.boolean(),
    },
    resolve: (query, _root, {type, limit, hasBandsPlaying}) =>
      prismaClient.event.findMany({
        ...query,
        orderBy: {
          start: 'desc',
        },
        take: limit ?? undefined,
        where: {
          eventType: type ?? undefined,
          BandPlaying:
            hasBandsPlaying != null
              ? hasBandsPlaying
                ? {some: {}}
                : {none: {}}
              : undefined,
        },
      }),
  }),
);

builder.queryField('eventsConnection', (t) =>
  t.prismaConnection({
    type: Event,
    args: {
      type: t.arg({
        type: EventType,
      }),
      hasBandsPlaying: t.arg.boolean(),
    },
    nodeNullable: false,
    edgesNullable: false,
    cursor: 'id',
    resolve: (query, parent, {type, hasBandsPlaying}) =>
      prismaClient.event.findMany({
        ...query,
        orderBy: {
          start: 'desc',
        },
        where: {
          eventType: type ?? undefined,
          BandPlaying:
            hasBandsPlaying != null
              ? hasBandsPlaying
                ? {some: {}}
                : {none: {}}
              : undefined,
        },
      }),
  }),
);
