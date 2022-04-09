import prismaClient from '../src/utils/prismaClient';
import sendMail from '../src/utils/sendMail';
import rejectBandApplication from '../src/maizzle/mails/rejectBandApplication';

(async () => {
  const eventYear = '2022';
  const data = await prismaClient.bandApplication.findMany({
    where: {
      contactedByViewerId: null,
      lastContactedAt: null,
      eventId: `kult${eventYear}`,
    },
  });

  for (const band of data) {
    await sendMail({
      to: 'daniel@buechele.cc', //TODO, remove safeguard band.email,
      from: 'Kulturspektakel Gauting Booking booking@kulturspektakel.de',
      subject: `Absage „${band.bandname}“ - Kulturspektakel ${eventYear}`,
      html: rejectBandApplication({
        bandname: band.bandname,
        eventYear,
      }),
    });

    await prismaClient.bandApplication.update({
      data: {
        lastContactedAt: new Date(),
      },
      where: {
        id: band.id,
      },
    });

    break;
  }
})();
