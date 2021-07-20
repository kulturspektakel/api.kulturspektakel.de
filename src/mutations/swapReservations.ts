import {Reservation} from '@prisma/client';
import {UserInputError} from 'apollo-server-express';
import {isAfter, isBefore} from 'date-fns';
import {extendType, nonNull, intArg} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('swapReservations', {
      type: 'Boolean',
      args: {
        a: nonNull(intArg()),
        b: nonNull(intArg()),
      },
      authorize: authorization('user'),
      resolve: async (_, {a, b}, {prismaClient}) => {
        const resA = await prismaClient.reservation.findUnique({
          where: {id: a},
          include: {
            table: {
              include: {
                reservations: true,
              },
            },
          },
        });
        const resB = await prismaClient.reservation.findUnique({
          where: {id: b},
          include: {
            table: {
              include: {
                reservations: true,
              },
            },
          },
        });

        if (!resA || !resB) {
          throw new UserInputError('Reservation not found');
        }

        if (
          resA.otherPersons.length + 1 > resB.table.maxCapacity ||
          resB.otherPersons.length + 1 > resA.table.maxCapacity
        ) {
          throw new UserInputError('Does not fit');
        }

        if (resA.table.areaId !== resB.table.areaId) {
          throw new UserInputError('Not in same area');
        }

        if (
          swapableReservation(resA.table.reservations, resB)?.id !== resA.id ||
          swapableReservation(resB.table.reservations, resA)?.id !== resB.id
        ) {
          throw new Error('Not swapable');
        }

        await prismaClient.$transaction([
          prismaClient.reservation.update({
            where: {
              id: resA.id,
            },
            data: {
              tableId: resB.tableId,
            },
          }),
          prismaClient.reservation.update({
            where: {
              id: resB.id,
            },
            data: {
              tableId: resA.tableId,
            },
          }),
        ]);

        return true;
      },
    });
  },
});
export function swapableReservation(
  tableReservations: Reservation[],
  withReservation: Reservation,
): Reservation | undefined {
  const aa = tableReservations.filter(
    (t) =>
      isAfter(t.endTime, withReservation.startTime) &&
      isBefore(t.startTime, withReservation.endTime),
  );

  if (aa.length === 1) {
    return aa[0];
  }
}
