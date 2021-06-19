import {extendType, stringArg, nonNull, list} from 'nexus';
import {UserInputError} from 'apollo-server-express';
import {occupancyIntervals} from './requestReservation';
import {config} from '../queries/config';
import {ReservationStatus} from '@prisma/client';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateReservation', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
        otherPersons: list(nonNull(stringArg())),
        startTime: 'DateTime',
        endTime: 'DateTime',
        tableId: 'ID',
        checkedInPersons: 'Int',
        note: 'String',
      },
      resolve: async (
        _,
        {
          token,
          otherPersons,
          startTime,
          endTime,
          tableId,
          checkedInPersons,
          note,
        },
        {prismaClient, token: auth},
      ) => {
        const reservation = await prismaClient.reservation.findUnique({
          include: {
            table: {
              include: {
                area: true,
                reservations: true,
              },
            },
          },
          where: {
            token,
          },
        });

        if (reservation == null) {
          throw new UserInputError('Reservierung konnte nicht gefunden werden');
        }

        if (auth?.type !== 'user' && reservation.status !== 'Confirmed') {
          // only authenticated users can change other reservations
          throw new UserInputError('Reservierung kann nicht bearbeitet werden');
        }

        if (otherPersons) {
          const oldPartySize = reservation.otherPersons.length + 1;
          otherPersons = otherPersons.map((p) => p.trim()).filter(Boolean);
          const newPartySize = otherPersons.length + 1;

          if (newPartySize > reservation.table.maxCapacity) {
            throw new UserInputError('Nicht genügend Platz am Tisch');
          }
          if (newPartySize > reservation.otherPersons.length + 1) {
            const occupancy = await occupancyIntervals(
              prismaClient,
              reservation.startTime,
              reservation.endTime,
            );
            if (
              occupancy.some(
                ({occupancy}) =>
                  occupancy - oldPartySize + newPartySize >
                  config.capacityLimit,
              )
            ) {
              throw new UserInputError('Nicht genügend Plätze');
            }
          }
        }

        if (startTime) {
          if (auth?.type !== 'user') {
            throw new UserInputError(
              'Reservierung kann nicht bearbeitet werden',
            );
          }
          if (
            // TODO
            reservation.table.reservations.some((r) => r.id != reservation.id)
          ) {
            throw new UserInputError('Nicht verfügbar');
          }
        }

        if (endTime) {
          if (auth?.type !== 'user') {
            throw new UserInputError(
              'Reservierung kann nicht bearbeitet werden',
            );
          }
          if (
            // TODO
            reservation.table.reservations.some((r) => r.id != reservation.id)
          ) {
            throw new UserInputError('Nicht verfügbar');
          }
        }

        if (tableId) {
          if (auth?.type !== 'user') {
            throw new UserInputError(
              'Reservierung kann nicht bearbeitet werden',
            );
          }
          const table = await prismaClient.table.findFirst({
            where: {
              id: tableId,
              maxCapacity: {
                gte: Math.max(
                  reservation.checkedInPersons,
                  (otherPersons?.length ?? reservation.otherPersons.length) + 1,
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
          if (auth?.type !== 'user') {
            throw new UserInputError(
              'Reservierung kann nicht bearbeitet werden',
            );
          }
          if (checkedInPersons > reservation.table.maxCapacity) {
            throw new UserInputError('Tisch zu klein');
          }
          status = 'CheckedIn';
          checkInTime = reservation?.checkInTime ?? new Date();
        }

        if (note && auth?.type !== 'user') {
          throw new UserInputError('Reservierung kann nicht bearbeitet werden');
        }

        // TODO maybe downsize table?

        return await prismaClient.reservation.update({
          data: {
            otherPersons,
            tableId,
            startTime,
            endTime,
            status,
            checkInTime,
            checkedInPersons,
            note,
          },
          where: {
            token,
          },
        });
      },
    });
  },
});
