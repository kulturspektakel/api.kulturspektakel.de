import BandPlaying from '../models/BandPlaying';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('findBandPlaying', (t) =>
  t.field({
    type: BandPlaying,
    nullable: true,
    args: {
      slug: t.arg.string({required: true}),
      eventId: t.arg.globalID({required: true}),
    },
    resolve: (_root, {slug, eventId}) => {
      return prismaClient.bandPlaying.findUnique({
        where: {
          eventId_slug: {
            slug,
            eventId: eventId.id,
          },
        },
      });
    },
  }),
);
