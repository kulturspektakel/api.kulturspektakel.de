import {extendType} from 'nexus';
import {getConfig} from '../utils/config';
import requireUserAuthorization from '../utils/requireUserAuthorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.field('availableCapacity', {
      type: 'Int',
      ...requireUserAuthorization,
      resolve: async (_parent, _args, {prismaClient}) => {
        const now = new Date();
        const reservations = await prismaClient.reservation.findMany({
          where: {
            OR: [
              {
                checkInTime: {
                  lte: now,
                },
              },
              {
                startTime: {
                  lte: now,
                },
              },
            ],
            endTime: {
              gte: now,
            },
            status: {
              in: ['Confirmed', 'CheckedIn'],
            },
          },
        });

        return (
          getConfig('CAPACITY_LIMIT') -
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
