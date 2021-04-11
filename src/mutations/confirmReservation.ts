import {extendType, stringArg, nonNull} from 'nexus';
import {getIcs} from '../routes/ics';
import {getPass} from '../routes/passkit';
import sendMail from '../utils/sendMail';
import streamToString from '../utils/streamToString';

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
              status: 'Confirmed',
            },
            where: {
              token,
            },
          });

          const ics = await getIcs(prismaClient, token);
          const attachments = [
            {
              content: Buffer.from(ics).toString('base64'),
              filename: 'reservation.ics',
              type: 'text/calendar',
            },
          ];

          const pass = await getPass(prismaClient, token);
          if (pass) {
            attachments.push({
              content: (await streamToString(pass)).toString('base64'),
              filename: 'pass.pkpass',
              type: 'application/vnd.apple.pkpass',
            });
          }

          try {
            await sendMail({
              to: reservation.primaryEmail,
              subject: 'Reservierung bestätigt',
              text: `Zum Bearbeiten hier klicken: https://table.kulturspektakel.de/reservation/${reservation.token}`,
              attachments,
            });
          } catch (e) {
            console.log(e.response.body);
          }
        }

        return reservation;
      },
    });
  },
});
