import {Area} from '@prisma/client';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import {extendType, nonNull} from 'nexus';

export default extendType({
  type: 'Area',
  definition: (t) => {
    t.nonNull.list.nonNull.field('bandsPlaying', {
      type: 'Band',
      args: {
        day: nonNull('Date'),
      },
      resolve: async (area, {day}, {prismaClient}) =>
        prismaClient.band.findMany({
          where: {
            AND: [
              {
                startTime: {
                  gte: startOfDay(day),
                  lte: endOfDay(day),
                },
              },
              {
                areaId: (area as Area).id,
              },
            ],
          },
        }),
    });
  },
});
