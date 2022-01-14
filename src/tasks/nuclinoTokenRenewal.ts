import prismaClient from '../utils/prismaClient';
import fetch from 'node-fetch';
import {getHeaders} from '../utils/nuclino';

export default async function () {
  const headers = await getHeaders(prismaClient);
  const res = await fetch(
    'https://api.nuclino.com/api/users/me/refresh-session',
    {
      method: 'POST',
      headers,
    },
  );
  const cookie = res.headers.get('Set-Cookie');

  if (!cookie) {
    throw new Error('No Cookie');
  }

  const match = cookie.match(/token=([A-Za-z0-9+-\._]+)/);
  if (!match || match.length < 2) {
    throw new Error('Cookie could not be parsed');
  }

  await prismaClient.config.update({
    data: {
      value: match[1],
    },
    where: {
      key: 'NuclinoToken',
    },
  });
}
