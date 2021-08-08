import {UserInputError} from 'apollo-server-express';
import {objectType} from 'nexus';
import {swapableReservation} from '../mutations/swapReservations';
import {config} from '../queries/config';
import authorization from '../utils/authorization';
import filterEmpty from '../utils/filterEmpty';
import {Reservation} from 'nexus-prisma';

export default objectType({
  name: 'Reservation',
  definition(t) {
    t.field(Reservation.id);
    t.field(Reservation.status);
    t.field(Reservation.token);
    t.field(Reservation.table);
    t.field(Reservation.tableId);
    t.field(Reservation.startTime);
    t.field(Reservation.endTime);
    t.field(Reservation.primaryPerson);
    t.field(Reservation.primaryEmail);
    t.field(Reservation.otherPersons);
    t.field({
      ...Reservation.checkedInPersons,
      authorize: authorization('user'),
    });
    t.field({
      ...Reservation.note,
      authorize: authorization('user'),
    });
    t.field({
      ...Reservation.checkInTime,
      authorize: authorization('user'),
    });

    t.nonNull.list.field('swappableWith', {
      type: 'Reservation',
      authorize: authorization('user'),
      resolve: async (reservation, _args, {prisma}) => {
        const res = await prisma.reservation.findUnique({
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

        const tables = await prisma.table.findMany({
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
      resolve: async (reservation, _args, {prisma}) => {
        return prisma.table.findMany({
          where: {
            maxCapacity: {
              gte: Math.max(
                reservation.checkedInPersons,
                reservation.otherPersons.length + 1,
              ),
            },
            id: {
              not: reservation.tableId,
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
      resolve: async (reservation, _args, {prisma}) => {
        const query = await prisma.reservation.aggregate({
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
