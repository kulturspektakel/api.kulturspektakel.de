require('dotenv').config();

import {fetchLineUp} from '../src/utils/bandsPlaying';
import prismaClient from '../src/utils/prismaClient';

(async () => {
  const events = await prismaClient.event.findMany({
    where: {
      eventType: 'Kulturspektakel',
    },
  });

  for (const event of events) {
    console.log(`${event.id}: Fetching lineup...`);
    const data = await fetchLineUp(event.start);

    await prismaClient.$transaction([
      prismaClient.bandPlaying.deleteMany({
        where: {
          eventId: event.id,
        },
      }),
      prismaClient.bandPlaying.createMany({
        data,
      }),
    ]);
    console.log(`${event.id}: Imported ${data.length} bands`);
  }
})();
