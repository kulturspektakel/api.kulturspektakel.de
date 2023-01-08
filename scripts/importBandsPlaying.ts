require('dotenv').config();

import {fetchLineUp} from '../src/utils/bandsPlaying';
import prismaClient from '../src/utils/prismaClient';

(async () => {
  const year = parseInt(process.argv.pop() ?? '');
  if (!year || year < 2000 || year > 2030) {
    throw new Error('Call with valid year.');
  }

  const date = new Date();
  date.setFullYear(year);

  const eventId = `kult${date.getFullYear()}`;
  const event = await prismaClient.event.findUniqueOrThrow({
    where: {
      id: eventId,
    },
  });

  const data = await fetchLineUp(event.start);
  console.log(`Fetched ${data.length} bands`);

  await prismaClient.$transaction([
    prismaClient.bandPlaying.deleteMany({
      where: {
        eventId,
      },
    }),
    prismaClient.bandPlaying.createMany({
      data,
    }),
  ]);
})();
