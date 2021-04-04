import {extendType, stringArg, nonNull} from 'nexus';
import sendMail from '../utils/sendMail';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('confirmReservation', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
      },
      resolve: async (_, {token}, {prismaClient}) => {
        const reservation = await prismaClient.reservation.findUnique({
          where: {
            token,
          },
        });

        if (reservation == null) {
          throw new Error('Reservation not found');
        }

        if (reservation.status === 'Pending') {
          await prismaClient.reservation.update({
            data: {
              status: 'Reserved',
            },
            where: {
              token,
            },
          });

          await sendMail({
            from: 'dani@kulturspektakel.de',
            to: reservation.primaryEmail,
            subject: 'Reservierung bestätigt',
            text: 'test',
          });
        }

        return reservation;
      },
    });
  },
});
