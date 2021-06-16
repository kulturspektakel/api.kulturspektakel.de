import {extendType} from 'nexus';
import requireUserAuthorization from '../utils/requireUserAuthorization';
import {config} from './config';

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
