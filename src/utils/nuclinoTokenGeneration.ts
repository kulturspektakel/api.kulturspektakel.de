import {URL} from 'url';
import {add} from 'date-fns';
import {fetchUser, slackApiRequest} from './slack';
import {ApiError} from './errorReporting';
import prismaClient from './prismaClient';
import {scheduleTask} from '../tasks';
import env from './env';

export default async function nuclinoTokenGeneration(
  userId: string,
  trigger_id: string,
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

  const response = await slackApiRequest('views.open', {
    trigger_id,
    view: {
      type: 'modal',
      callback_id: 'modal-identifier',
      title: {
        type: 'plain_text',
        text: 'Nuclino Login',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Nuclino-Login für ${user.displayName}. Klicke den Button in den nächsten 5 Minuten um Nuclino zu öffnen.`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Nuclino öffnen',
                emoji: true,
              },
              value: 'click_me_123',
              url: url.toString(),
            },
          ],
        },
      ],
    },
  });

  console.log(response);

  if (!response.ok) {
    throw new Error(response.error);
  }
}
