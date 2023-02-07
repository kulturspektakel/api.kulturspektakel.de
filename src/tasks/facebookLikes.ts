import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';
import fetch from 'node-fetch';
import {URL} from 'url';
import env from '../utils/env';

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

  if (
    !url.hostname.endsWith('facebook.com') &&
    !url.hostname.endsWith('fb.com') &&
    !url.hostname.endsWith('fb.me')
  ) {
    return;
  }

  const path = url.pathname.split('/');
  let fbid: string | null = null;
  const match = path[1].match(/[a-z-]+-(\d{7}\d+)$/i);
  if (match != null && match.length > 1) {
    fbid = match[1];
  } else if (path[1] === 'pages' && path[2] === 'category') {
    fbid = path[3];
  } else {
    fbid = path[1];
  }
  const res: {
    followers_count?: number;
  } = await fetch(
    `https://graph.facebook.com/v16.0/${fbid}?fields=followers_count&access_token=${env.FACEBOOK_ACCESS_TOKEN}`,
  ).then((r) => r.json());

  if (res.followers_count != null) {
    await prismaClient.bandApplication.update({
      data: {
        facebookLikes: res.followers_count,
      },
      where: {
        id,
      },
    });
  } else {
    logger.debug(res);
  }
}
