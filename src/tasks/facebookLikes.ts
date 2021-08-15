import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';
import fetch from 'node-fetch';
import {URL} from 'url';

export default async function ({id}: {id: string}, {logger}: JobHelpers) {
  const application = await prismaClient.bandApplication.findUnique({
    where: {
      id,
    },
  });
  if (!application?.facebook) {
    return;
  }

  const url = new URL(application.facebook);
  const fbid = url.pathname.split('/')[1];
  const text = await fetch(`https://www.facebook.com/${fbid}`, {
    headers: {
      'User-Agent': 'Paw/3.2.2 (Macintosh; OS X/11.4.0) GCDHTTPRequest',
    },
  }).then((r) => r.text());

  const match = text.match(/FollowAction","userInteractionCount":"?(\d+)/);
  if (match && match?.length > 1) {
    await prismaClient.bandApplication.update({
      data: {
        facebookLikes: parseInt(match[1], 10),
      },
      where: {
        id,
      },
    });
  }
}
