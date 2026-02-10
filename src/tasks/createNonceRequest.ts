import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';
import {slackApiRequest, SlackApiUser} from '../utils/slack';
import {upsertViewer} from '../utils/upsertViewer';

export default async function (
  {id, email}: {id: string; email: string},
  {logger}: JobHelpers,
) {
  const nonceRequest = await prismaClient.nonceRequest.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const slackUser = await slackApiRequest<{
    user: SlackApiUser;
  }>(`users.lookupByEmail?email=${email}`);

  if (!slackUser.ok) {
    return null;
  }
  const viewer = await upsertViewer(slackUser.user.id, 'createNonceRequest');
  await prismaClient.nonceRequest.update({
    where: {
      id,
    },
    data: {
      createdForId: viewer.id,
    },
  });

  await slackApiRequest('chat.postMessage', {
    channel: slackUser.user.id,
    text: 'Nuclino Login-Anfrage bestätigen',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Bestätige, dass du dich gerade mit deinem Nuclino-Account einloggen möchtest. Wenn du gerade nicht versuchst dich einzuloggen, lehne die Anfrage ab.',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            style: 'primary',
            text: {
              type: 'plain_text',
              text: 'Bestätigen',
            },
            action_id: 'approve-nonce-request',
            value: nonceRequest,
          },
          {
            type: 'button',
            style: 'danger',
            text: {
              type: 'plain_text',
              text: 'Ablehnen',
            },
            action_id: 'reject-nonce-request',
            value: nonceRequest,
          },
        ],
      },
    ],
  });
}
