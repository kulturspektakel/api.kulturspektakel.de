import {extendType} from 'nexus';
import {config} from './config';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.field('availableCapacity', {
      type: 'Int',
      args: {
        time: 'DateTime',
      },
      resolve: async (_parent, args, {prisma}) => {
        const time = args.time ?? new Date();
        const reservations = await prisma.reservation.findMany({
          where: {
            OR: [
              {
                checkInTime: {
                  lte: time,
                },
              },
              {
                startTime: {
                  lte: time,
                },
              },
            ],
            endTime: {
              gte: time,
            },
          },
        });

        return (
          config.capacityLimit -
          reservations.reduce(
            (acc, cv) =>
              acc + Math.max(cv.checkedInPersons, cv.otherPersons.length + 1),
            0,
          )
        );
      },
    });
  },
});
