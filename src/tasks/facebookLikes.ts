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
    !url.hostname.endsWith('facebook.de') &&
    !url.hostname.endsWith('fb.me')
  ) {
    return;
  }

  const path = url.pathname.split('/');
  let fbid: string | null = null;
  const match = path[1].match(/[a-z-]+-(\d{7}\d+)$/i);
  if (url.pathname.startsWith('/profile.php?id=')) {
    fbid = url.pathname.match(/profile.php\?id=(\d+)/)?.at(1) ?? null;
  } else if (match != null && match.length > 1) {
    fbid = match[1];
  } else if (path[1] === 'pages' && path[2] === 'category') {
    fbid = path[3];
  } else {
    fbid = path[1];
  }

  const res = await fetch(
    `https://graph.facebook.com/v16.0/${fbid}?fields=followers_count&access_token=${env.FACEBOOK_ACCESS_TOKEN}`,
  );

  if (!res.ok) {
    const text = await res.text();
    logger.error(text);
    throw new Error(`Facebook API error: ${text}`);
  }

  const data: {
    followers_count?: number;
  } = await res.json();

  if (data.followers_count != null) {
    await prismaClient.bandApplication.update({
      data: {
        facebookLikes: data.followers_count,
      },
      where: {
        id,
      },
    });
  } else {
    logger.error(JSON.stringify(res));
    throw new Error(`Facebook API error: ${res}`);
  }
}
