import {extendType, stringArg, nonNull} from 'nexus';
import reservationConfirmed from '../maizzle/mails/reservationConfirmed';
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
        let reservation = await prismaClient.reservation.findUnique({
          where: {
            token,
          },
          include: {
            table: {
              include: {
                area: true,
              },
            },
          },
        });

        if (reservation == null) {
          throw new Error('Reservation not found');
        }

        // if (reservation.status === 'Pending') {
        reservation = await prismaClient.reservation.update({
          data: {
            status: 'Confirmed',
          },
          where: {
            token,
          },
          include: {
            table: {
              include: {
                area: true,
              },
            },
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
            subject: `Reservierungsanfrage #${reservation.id}`,
            attachments,
            html: reservationConfirmed({
              day: reservation.startTime.toLocaleDateString('de', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                timeZone: 'Europe/Berlin',
              }),
              startTime: reservation.startTime.toLocaleTimeString('de', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Berlin',
              }),
              endTime: reservation.endTime.toLocaleTimeString('de', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Berlin',
              }),
              number: String(reservation.id),
              area: reservation.table.area.displayName,
              partySize: String(reservation.otherPersons.length + 1),
            }),
          });
        } catch (e) {
          console.log(e.response.body);
        }
        // }

        return reservation;
      },
    });
  },
});
