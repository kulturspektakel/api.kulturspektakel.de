import {extendType, stringArg, nonNull, list} from 'nexus';
import {UserInputError} from 'apollo-server-express';
import {occupancyIntervals} from './requestReservation';
import {config} from '../queries/config';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateReservation', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
        otherPersons: nonNull(list(nonNull(stringArg()))),
      },
      resolve: async (_, {token, otherPersons}, {prismaClient}) => {
        const reservation = await prismaClient.reservation.findUnique({
          include: {
            table: {
              include: {
                area: true,
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

        if (reservation.status !== 'Confirmed') {
          throw new UserInputError('Reservierung kann nicht bearbeitet werden');
        }

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
                occupancy - oldPartySize + newPartySize > config.capacityLimit,
            )
          ) {
            throw new UserInputError('Nicht genügend Plätze');
          }
        }

        // TODO maybe downsize table?

        return await prismaClient.reservation.update({
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
