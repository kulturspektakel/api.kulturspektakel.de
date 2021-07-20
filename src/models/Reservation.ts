import {Reservation} from '@prisma/client';
import {UserInputError} from 'apollo-server-express';
import {objectType} from 'nexus';
import {swapableReservation} from '../mutations/swapReservations';
import {config} from '../queries/config';
import authorization from '../utils/authorization';
import filterEmpty from '../utils/filterEmpty';

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
    t.model.primaryEmail();
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

    t.nonNull.list.field('swappableWith', {
      type: 'Reservation',
      authorize: authorization('user'),
      resolve: async (reservation, _args, {prismaClient}) => {
        const res = await prismaClient.reservation.findUnique({
          where: {id: reservation.id},
          include: {
            table: {
              include: {
                reservations: true,
              },
            },
          },
        });

        if (!res) {
          throw new UserInputError('Reservation not found');
        }

        const tables = await prismaClient.table.findMany({
          where: {
            areaId: res.table.areaId,
            maxCapacity: {
              gte: res.otherPersons.length + 1,
            },
            id: {
              not: res.tableId,
            },
          },
          include: {
            reservations: true,
          },
        });

        return tables
          .flatMap((t) => {
            const swapableR = swapableReservation(t.reservations, res);
            if (!swapableR) {
              return;
            }
            if (
              swapableReservation(res.table.reservations, swapableR)?.id ===
              res.id
            ) {
              return swapableR;
            }
          })
          .filter(filterEmpty);
      },
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
            area: {
              areaOpeningHour: {
                some: {
                  startTime: {
                    lte: reservation.startTime,
                  },
                  endTime: {
                    gte: reservation.endTime,
                  },
                },
              },
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
