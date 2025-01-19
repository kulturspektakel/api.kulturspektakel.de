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

  if (res.status === 404) {
    logger.error(`Instagram user ${application.instagram} not found`);
    return;
  } else if (res.status === 401) {
    //  ERROR: 401Istindermache
    // [job(worker-09b846ca766681bc21: instagramFollower{103806})] ERROR: {"message":"Please wait a few minutes before you try again.","require_login":true,"igweb_rollout":true,"status":"fail"}
    // TODO back off
    return;
  }

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
      logger.error(JSON.stringify(json));
    }
  } catch (e) {
    logger.error(String(e));
  }
}
