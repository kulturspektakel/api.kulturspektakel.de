import {extendType, stringArg, nonNull, list} from 'nexus';
import {UserInputError} from 'apollo-server-express';
import {checkOccupancy} from './requestReservation';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateReservationOtherPersons', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
        otherPersons: nonNull(list(nonNull(stringArg()))),
      },
      resolve: async (_, {token, otherPersons}, {prisma, token: auth}) => {
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
            token,
          },
        });

        if (reservation == null) {
          throw new UserInputError('Reservierung konnte nicht gefunden werden');
        }

        if (auth?.type !== 'user' && reservation.status !== 'Confirmed') {
          throw new UserInputError('Reservierung kann nicht bearbeitet werden');
        }

        const oldPartySize = reservation.otherPersons.length + 1;
        otherPersons = otherPersons.map((p) => p.trim()).filter(Boolean);
        const newPartySize = otherPersons.length + 1;

        if (newPartySize > reservation.table.maxCapacity) {
          throw new UserInputError('Nicht genügend Platz am Tisch');
        }
        if (newPartySize > reservation.otherPersons.length + 1) {
          await checkOccupancy(
            prisma,
            reservation.startTime,
            reservation.endTime,
            -oldPartySize + newPartySize,
          );
        }

        // TODO maybe downsize table?

        return await prisma.reservation.update({
          data: {
            otherPersons,
          },
          where: {
            token,
          },
        });
      },
    });
  },
});
