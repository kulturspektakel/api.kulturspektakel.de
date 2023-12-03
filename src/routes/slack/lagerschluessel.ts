import env from '../../utils/env';
import prismaClient from '../../utils/prismaClient';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';
import {Hono} from 'hono';

const app = new Hono();

app.post('/update', async (c) => {
  const body = await c.req.json<{
    positionType: string;
    verticalAccuracy: number;
    longitude: number;
    floorLevel: number;
    isInaccurate: boolean;
    isOld: boolean;
    horizontalAccuracy: number;
    latitude: number;
    timeStamp: number;
    altitude: number;
    locationFinished: boolean;
  }>();

  const timeStamp = new Date(body.timeStamp);
  await prismaClient.itemLocation.upsert({
    where: {
      timeStamp,
    },
    create: {
      timeStamp,
      latitude: body.latitude,
      longitude: body.longitude,
      payload: body,
    },
    update: {
      latitude: body.latitude,
      longitude: body.longitude,
    },
  });
  return c.status(200);
});

app.post('/', async (c) => {
  const {latitude, longitude, timeStamp} =
    await prismaClient.itemLocation.findFirstOrThrow({
      orderBy: {
        timeStamp: 'desc',
      },
    });
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const image_url = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${env.GOOGLE_MAPS_KEY}`;

  const apiRequest = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=de&key=${env.GOOGLE_MAPS_KEY}`,
  );

  const data = await apiRequest.json();
  const address =
    data.results.at(0)?.formatted_address ?? 'Unbekannte Position';

  return c.json(
    {
      text: 'Lagerschlüssel Position',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Der Lagerschlüssel wurde zuletzt vor ${ago(
              timeStamp,
            )} in <${mapLink}|${address}> gesehen.`,
          },
        },
        {
          type: 'image',
          title: {
            type: 'plain_text',
            text: address,
            emoji: true,
          },
          image_url,
          alt_text: 'Karte mit Position des Lagerschlüssels',
        },
      ],
    },
    200,
  );
});

function ago(d: Date) {
  const minutes = differenceInMinutes(new Date(), d);
  if (minutes < 60) {
    return `${minutes} Minuten`;
  }
  const hours = differenceInHours(new Date(), d);
  if (hours < 24) {
    return `${hours} Stunden`;
  }
  const days = differenceInDays(new Date(), d);
  return `${days} Tage`;
}

export default app;
