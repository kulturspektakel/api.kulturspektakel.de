import {URL} from 'url';
import {add} from 'date-fns';
import {fetchUser} from './slack';
import {ApiError} from './errorReporting';
import prismaClient from './prismaClient';
import {scheduleTask} from '../tasks';
import env from './env';
import fetch from 'node-fetch';

export default async function nuclinoTokenGeneration(
  userId: string,
  responseUrl: string,
  redirectUrl = 'https://app.nuclino.com/Kulturspektakel/General',
) {
  const slackUser = await fetchUser(userId);
  if (!slackUser) {
    throw new ApiError(404, 'User not found');
  }

  const userData = {
    displayName: slackUser.profile.real_name,
    profilePicture: slackUser.profile.image_192,
    email: slackUser.profile.email,
  };
  const user = await prismaClient.viewer.upsert({
    create: userData,
    update: userData,
    where: {
      id: slackUser.id,
    },
  });

  const expiresAt = add(new Date(), {minutes: 5});
  const nonce = await prismaClient.nonce.create({
    data: {
      createdForId: user.id,
      expiresAt,
    },
  });
  await scheduleTask(
    'nonceInvalidate',
    {nonce: nonce.nonce},
    {
      runAt: expiresAt,
    },
  );

  const nuclinoSsoUrl = new URL(
    `https://api.nuclino.com/api/sso/${env.NUCLINO_TEAM_ID}/login`,
  );
  nuclinoSsoUrl.searchParams.append('redirectUrl', redirectUrl);
  const url = new URL('https://api.kulturspektakel.de/slack/token');
  url.searchParams.append('nonce', nonce.nonce);
  url.searchParams.append('redirect', nuclinoSsoUrl.toString());

  await fetch(responseUrl, {
    headers: {
      'Content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      response_type: 'ephemeral',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Hier ist dein Nuclino-Login`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Nuclino öffnen',
              emoji: true,
            },
            value: url,
            url: url,
            action_id: 'nuclino-login-open',
          },
        },
      ],
    }),
  });
}
