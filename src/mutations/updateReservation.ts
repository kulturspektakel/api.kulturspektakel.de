import {extendType, stringArg, nonNull, list} from 'nexus';
import isEmail from '../utils/isEmail';
import {UserInputError} from 'apollo-server-express';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateReservation', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
        primaryEmail: nonNull(stringArg()),
        primaryPerson: nonNull(stringArg()),
        otherPersons: nonNull(list(nonNull(stringArg()))),
      },
      resolve: async (
        _,
        {token, primaryEmail, primaryPerson, otherPersons},
        {prismaClient},
      ) => {
        const reservation = await prismaClient.reservation.findUnique({
          include: {
            table: true,
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

        otherPersons = otherPersons.filter(Boolean);
        if (!primaryPerson || !isEmail(primaryEmail)) {
          throw new UserInputError('Name/E-Mail ungültig');
        }
        const newPartySize = otherPersons.length + 1;

        if (newPartySize > reservation.table.maxCapacity) {
          throw new UserInputError('Nicht genügend Platz am Tisch');
        }
        // TODO party size increased, check with area capacity
        // areaLimitNotExceeded(slots, otherPersons.length - reservation.otherPersons.length)

        // TODO maybe downsize table?

        return await prismaClient.reservation.update({
          data: {
            primaryEmail,
            primaryPerson,
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
