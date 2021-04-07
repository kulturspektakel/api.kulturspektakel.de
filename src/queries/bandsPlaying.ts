import {ReservationSlot} from '.prisma/client';
import {extendType} from 'nexus';

export default extendType({
  type: 'ReservationSlot',
  definition: (t) => {
    t.nonNull.list.nonNull.field('bandsPlaying', {
      type: 'Band',
      resolve: async (slot, _args, {prismaClient}) =>
        prismaClient.band.findMany({
          where: {
            AND: [
              {
                startTime: {
                  lt: slot.endTime,
                },
              },
              {
                endTime: {
                  gt: slot.startTime,
                },
              },
              {
                areaId: (slot as ReservationSlot).areaId,
              },
            ],
          },
        }),
    });
  },
});
