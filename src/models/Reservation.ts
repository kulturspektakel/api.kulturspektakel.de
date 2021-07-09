import {Reservation} from '@prisma/client';
import {objectType} from 'nexus';
import {config} from '../queries/config';
import authorization from '../utils/authorization';

export default objectType({
  name: 'Reservation',
  definition(t) {
    t.model.id();
    t.model.status();
    t.model.token();
    t.model.table();
    t.model.startTime();
    t.model.endTime();
    t.model.primaryPerson();
    t.model.otherPersons();
    t.model.checkedInPersons({
      authorize: authorization('user'),
    });
    t.model.note({
      authorize: authorization('user'),
    });
    t.model.checkInTime({
      authorize: authorization('user'),
    });

    t.nonNull.list.field('alternativeTables', {
      type: 'Table',
      authorize: authorization('user'),
      resolve: async (reservation, _args, {prismaClient}) => {
        return prismaClient.table.findMany({
          where: {
            maxCapacity: {
              gte: Math.max(
                reservation.checkedInPersons,
                reservation.otherPersons.length + 1,
              ),
            },
            id: {
              not: (reservation as Reservation).tableId,
            },
            reservations: {
              every: {
                OR: [
                  {
                    startTime: {
                      gte: reservation.endTime,
                    },
                  },
                  {
                    endTime: {
                      lte: reservation.startTime,
                    },
                  },
                ],
              },
            },
          },
        });
      },
    });

    t.nonNull.field('availableToCheckIn', {
      type: 'Int',
      authorize: authorization('user'),
      resolve: async (reservation, _args, {prismaClient}) => {
        const query = await prismaClient.reservation.aggregate({
          _sum: {
            checkedInPersons: true,
          },
          where: {
            endTime: {
              gte: reservation.startTime,
            },
            checkInTime: {
              lt: reservation.endTime,
            },
            id: {
              not: reservation.id,
            },
          },
        });
        return config.capacityLimit - (query?._sum.checkedInPersons ?? 0);
      },
    });
  },
});
