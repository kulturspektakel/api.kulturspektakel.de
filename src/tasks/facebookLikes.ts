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

  const fbid = await extractFbid(application.facebook);
  if (!fbid) {
    return;
  }
  const res = await fetch(
    `https://graph.facebook.com/v24.0/${fbid}?fields=followers_count&access_token=${env.FACEBOOK_ACCESS_TOKEN}`,
  );

  const data:
    | {
        followers_count?: number;
      }
    | {
        error: {
          message: string;
          type: string;
          code: number;
          error_subcode: number;
        };
      } = await res.json().catch(() => null);

  if (!data) {
    const text = await res.text();
    logger.error(text);
    throw new Error(`Facebook API error: ${text}`);
  }

  if (res.ok && 'followers_count' in data) {
    await prismaClient.bandApplication.update({
      data: {
        facebookLikes: data.followers_count,
      },
      where: {
        id,
      },
    });
  } else if (
    'error' in data &&
    data.error.code === 100 &&
    data.error.error_subcode === 33
  ) {
    // Private profile
    return;
  } else {
    const text = await res.text();
    throw new Error(`Facebook API error: ${text}`);
  }
}

export async function extractFbid(uri: string, followRedirects = true) {
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
  if (path[1] === 'share' && followRedirects) {
    const res = await fetch(uri, {
      method: 'HEAD',
      redirect: 'follow',
    });
    return await extractFbid(res.url, false);
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
