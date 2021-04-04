import {extendType, stringArg, nonNull, list} from 'nexus';
import isEmail from '../utils/isEmail';
import {UserInputError} from 'apollo-server-express';
import {PrismaClient, ReservationSlot, ReservationStatus} from '.prisma/client';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateReservation', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
        primaryEmail: nonNull(stringArg()),
        primaryPerson: nonNull(stringArg()),
        otherEmails: nonNull(list(nonNull(stringArg()))),
        otherPersons: nonNull(list(nonNull(stringArg()))),
      },
      resolve: async (
        _,
        {token, primaryEmail, primaryPerson, otherEmails, otherPersons},
        {prismaClient},
      ) => {
        const reservation = await prismaClient.reservation.findUnique({
          where: {
            token,
          },
        });

        if (reservation == null) {
          throw new UserInputError('Reservation not found');
        }

        if (
          primaryPerson.length < 1 ||
          !isEmail(primaryEmail) ||
          otherPersons.some((p) => p.length === 0) ||
          otherEmails.some((e) => !isEmail(e))
        ) {
          throw new UserInputError('Invalid input data');
        }
        otherPersons = otherPersons.filter(Boolean);
        otherEmails = otherEmails.filter(Boolean);

        if (otherPersons.length > reservation.otherPersons.length) {
          // TODO party size increased, check with area limit
          // areaLimitNotExceeded(slots, otherPersons.length - reservation.otherPersons.length)
        }

        // TODO maybe downsize table?

        return await prismaClient.reservation.update({
          data: {
            primaryEmail,
            primaryPerson,
            otherEmails,
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
