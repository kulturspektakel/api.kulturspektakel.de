require('dotenv').config();

import {fetchLineUp} from '../src/utils/kirby';
import {uploadImage} from '../src/utils/directus';
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
        data: data.map((d) => d.content),
      }),
    ]);

    console.log(`Created ${data.length} bands, startinto upload photos`);

    await Promise.all(
      data.map(async ({files}, i) => {
        if (files.length === 0) {
          return;
        }
        const file = await uploadImage(files[0].url, {
          title: `${data[i].content.name} ${event.start.getFullYear()}`,
          folder: '3c60a90c-b1d6-4f76-9678-a078c0ae7193',
          tags: [event.start.getFullYear().toString()],
        });
        await prismaClient.$queryRaw`update "BandPlaying" set "photo"=${file.data.id}::uuid where "id"=${data[i].content.id}`;
      }),
    );

    console.log(`${event.id}: Imported ${data.length} bands`);
  }
})();
