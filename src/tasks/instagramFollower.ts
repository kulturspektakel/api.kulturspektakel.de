import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';

export default async function (
  {id, cookie = ''}: {id: string; cookie?: string},
  {logger}: JobHelpers,
) {
  const application = await prismaClient.bandApplication.findUnique({
    where: {
      id,
    },
  });

  if (!application?.instagram) {
    return;
  }

  const res = await fetch(
    `https://i.instagram.com/api/v1/users/web_profile_info/?username=${application.instagram}`,
    {
      headers: {
        'X-IG-App-ID': '936619743392459',
        cookie,
      },
    },
  );

  if (res.ok) {
    const json: {
      data?: {
        user?: {
          edge_followed_by?: {
            count?: number;
          };
        };
      };
    } = await res.json();

    if (json?.data?.user?.edge_followed_by?.count != null) {
      await prismaClient.bandApplication.update({
        data: {
          instagramFollower: json.data.user.edge_followed_by.count,
        },
        where: {
          id,
        },
      });
      return;
    } else {
      const e = new Error('Missing');
      e.message = JSON.stringify(json);
      logger.error(e.message);
      throw e;
    }
  } else if (res.status === 404) {
    logger.error(`Instagram user ${application.instagram} not found`);
    return;
  } else {
    throw new Error(await res.text());
  }
}
