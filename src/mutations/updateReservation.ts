import {extendType, nonNull, intArg} from 'nexus';
import {UserInputError} from 'apollo-server-express';
import authorization from '../utils/authorization';
import {ReservationStatus} from '@prisma/client';
import {isAfter, isBefore} from 'date-fns';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateReservation', {
      type: 'Reservation',
      args: {
        id: nonNull(intArg()),
        startTime: 'DateTime',
        endTime: 'DateTime',
        tableId: 'ID',
        checkedInPersons: 'Int',
        note: 'String',
        primaryPerson: 'String',
      },
      authorize: authorization('user'),
      resolve: async (
        _,
        {
          id,
          startTime,
          endTime,
          tableId,
          checkedInPersons,
          note,
          primaryPerson,
        },
        {prisma},
      ) => {
        const reservation = await prisma.reservation.findUnique({
          include: {
            table: {
              include: {
                area: true,
                reservations: true,
              },
            },
          },
          where: {
            id,
          },
        });

        if (reservation == null) {
          throw new UserInputError('Reservierung konnte nicht gefunden werden');
        }

        if (startTime) {
          if (
            reservation.table.reservations.some(
              (r) =>
                r.id != reservation.id &&
                isBefore(r.startTime, reservation.endTime) &&
                isAfter(r.endTime, startTime),
            )
          ) {
            throw new UserInputError('Nicht verfügbar');
          }
        }

        if (endTime) {
          if (
            reservation.table.reservations.some(
              (r) =>
                r.id != reservation.id &&
                isBefore(r.startTime, endTime) &&
                isAfter(r.endTime, reservation.startTime),
            )
          ) {
            throw new UserInputError('Nicht verfügbar');
          }
        }

        if (tableId) {
          const table = await prisma.table.findFirst({
            where: {
              id: tableId,
              maxCapacity: {
                gte: Math.max(
                  reservation.checkedInPersons,
                  reservation.otherPersons.length + 1,
                ),
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
          if (!table) {
            throw new UserInputError('Tischänderung nicht möglich');
          }
        }

        let status: ReservationStatus | undefined;
        let checkInTime: Date | undefined;
        if (checkedInPersons) {
          if (checkedInPersons > reservation.table.maxCapacity) {
            throw new UserInputError('Tisch zu klein');
          }
          status = 'CheckedIn';
          checkInTime = reservation?.checkInTime ?? new Date();
        }

        return await prisma.reservation.update({
          data: {
            tableId: tableId ?? undefined,
            startTime,
            endTime,
            status,
            checkInTime,
            checkedInPersons: checkedInPersons ?? undefined,
            note,
            primaryPerson: primaryPerson ?? undefined,
          },
          where: {
            id,
          },
        });
      },
    });
  },
});
