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

  try {
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
    } else {
      logger.debug(JSON.stringify(json));
    }
  } catch (e) {
    logger.debug(String(e));
  }
}
