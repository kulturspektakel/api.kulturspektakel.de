import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';
import {slackApiRequest, SlackApiUser} from '../utils/slack';
import {upsertViewer} from '../utils/upsertViewer';

export default async function ({id}: {id: string}, {logger}: JobHelpers) {
  const nonceRequest = await prismaClient.nonceRequest.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const slackUser = await slackApiRequest<{
    user: SlackApiUser;
  }>(`users.lookupByEmail?email=${nonceRequest.createdForEmail}`);

  if (!slackUser.ok) {
    return null;
  }
  await upsertViewer(slackUser.user.id, 'createNonceRequest');

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
