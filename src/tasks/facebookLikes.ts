import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';
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

  const fbid = extractFbid(application.facebook);
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

export function extractFbid(uri: string) {
  const url = new URL(uri);

  if (
    !url.hostname.endsWith('facebook.com') &&
    !url.hostname.endsWith('fb.com') &&
    !url.hostname.endsWith('facebook.de') &&
    !url.hostname.endsWith('fb.me')
  ) {
    return;
  }

  const path = url.pathname.split('/');
  if (url.pathname === '/profile.php') {
    return url.searchParams.get('id');
  }

  if ((path[1] === 'pages' || path[1] === 'people') && path.length > 3) {
    return path[3];
  }

  let slug = path[1];
  if (path[1] === 'p' && path.length > 2) {
    slug = path[2];
  }

  const match = slug.match(/[a-z-]+-(\d{7}\d+)$/i);
  if (match != null && match.length > 1) {
    return match[1];
  }

  return path[1];
}
