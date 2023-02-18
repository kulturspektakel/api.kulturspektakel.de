import fetch from 'node-fetch';
import env from './env';

export async function uploadImage(
  imageUrl: string,
  data: {title?: string; folder?: string; tags?: string[]},
): Promise<{
  data: {
    id: string;
  };
}> {
  return fetch(`https://cms.kulturspektakel.de/files/import`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.DIRECTUS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      url: `https://ik.imagekit.io/hmypy8m0ddz/tr:w-4000,h-4000,c-at_max,f-jpg/${imageUrl}`,
      data,
    }),
  }).then((res) => res.json());
}
