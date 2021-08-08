import {Area, PrismaClient, Reservation, Table} from '.prisma/client';
import {extendType, stringArg, nonNull} from 'nexus';
import Mail from 'nodemailer/lib/mailer';
import reservationConfirmed from '../maizzle/mails/reservationConfirmed';
import {getIcs} from '../routes/ics';
import {getPass} from '../routes/passkit';
import {scheduleTask} from '../tasks';
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
      resolve: async (_, {token}, {prisma}) => {
        let reservation = await prisma.reservation.findUnique({
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

        if (reservation.status === 'Pending') {
          reservation = await prisma.reservation.update({
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

          await sendConfirmationMail(prisma, reservation);
        }

        return reservation;
      },
    });
  },
});

export async function sendConfirmationMail(
  prisma: PrismaClient,
  reservation: Reservation & {
    table: Table & {
      area: Area;
    };
  },
) {
  const ics = await getIcs(prisma, reservation.token);
  const attachments: Mail.Attachment[] = [
    {
      content: Buffer.from(ics).toString('base64'),
      filename: 'reservation.ics',
      contentType: 'text/calendar',
      encoding: 'base64',
    },
  ];

  const pass = await getPass(prisma, reservation.token);
  if (pass) {
    attachments.push({
      content: (await streamToString(pass)).toString('base64'),
      filename: 'pass.pkpass',
      contentType: 'application/vnd.apple.pkpass',
      encoding: 'base64',
    });
  }

  try {
    await sendMail({
      to: reservation.primaryEmail,
      subject: `Reservierung #${reservation.id} bestätigt`,
      attachments,
      html: reservationConfirmed({
        day: reservation.startTime.toLocaleDateString('de', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
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
        token: reservation.token,
      }),
    });
  } catch (e) {
    console.error(e);
  }
  await scheduleTask('reservationSlackMessage', {id: reservation.id});
}
