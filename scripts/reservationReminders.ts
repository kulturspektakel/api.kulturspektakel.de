import prismaClient from '../src/utils/prismaClient';
import sendMail from '../src/utils/sendMail';
import reservationReminder from '../src/maizzle/mails/reservationReminder';

(async () => {
  console.log('test');

  const reservations = await prismaClient.reservation.findMany({
    where: {
      status: {
        in: ['Confirmed'],
      },
    },
    include: {
      table: {
        include: {
          area: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  const mails = reservations.reduce((acc, cv) => {
    if (!acc.has(cv.primaryEmail)) {
      return acc.set(cv.primaryEmail, [cv]);
    }
    acc.get(cv.primaryEmail)!.push(cv);
    return acc;
  }, new Map<string, typeof reservations>());

  for (const [email, reservations] of Array.from(mails.entries())) {
    await sendMail({
      to: email,
      subject: 'Deine Reservierung am Kulturspektakel',
      html: reservationReminder({
        reservations: reservations
          .map(
            (r) =>
              `<li><strong>#${r.id}:</strong> ${r.startTime.toLocaleString(
                'de',
                {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'Europe/Berlin',
                },
              )} bis ${r.endTime.toLocaleTimeString('de', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Berlin',
              })} Uhr, ${r.table.area.displayName}, ${
                r.otherPersons.length + 1
              }&nbsp;Personen <a class="hover-no-underline" style="color: #e12e2e;" href="https://table.kulturspektakel.de/reservation/${
                r.token
              }">&rarr;&nbsp;Reservierung #${r.id} bearbeiten</a></li>`,
          )
          .join(''),
      }),
    });

    await prismaClient.reservationReminderSent.create({
      data: {
        email,
        numberOfReservations: reservations.length,
      },
    });
    console.log(`Sent to: ${email}`);
    sleep(200);
  }
})();

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
