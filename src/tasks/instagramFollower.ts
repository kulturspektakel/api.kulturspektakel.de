import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';
import fetch from 'node-fetch';

export default async function ({id}: {id: string}, {logger}: JobHelpers) {
  const application = await prismaClient.bandApplication.findUnique({
    where: {
      id,
    },
  });

  if (!application?.instagram) {
    return;
  }

  const text = await fetch(
    `https://www.instagram.com/${application.instagram}/`,
    {
      headers: {
        'User-Agent': 'Paw/3.2.2 (Macintosh; OS X/11.4.0) GCDHTTPRequest',
      },
    },
  ).then((r) => r.text());

  const match = text.match(/"userInteractionCount":"?(\d+)/);
  if (match && match?.length > 1) {
    console.log(match[1]);
    await prismaClient.bandApplication.update({
      data: {
        instagramFollower: parseInt(match[1], 10),
      },
      where: {
        id,
      },
    });
  }
}
