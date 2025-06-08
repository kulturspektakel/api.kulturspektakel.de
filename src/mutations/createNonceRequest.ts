import {builder} from '../pothos/builder';
import {createNonceRequest} from '../utils/createNonce';
import {SlackApiUser, slackApiRequest} from '../utils/slack';
import {upsertViewer} from '../utils/upsertViewer';

builder.mutationField('createNonceRequest', (t) =>
  t.field({
    type: 'String',
    nullable: true,
    args: {
      email: t.arg({type: 'String', required: true}),
    },
    resolve: async (_, {email}) => {
      const slackUser = await slackApiRequest<{
        user: SlackApiUser;
      }>(`users.lookupByEmail?email=${email}`);

      if (!slackUser.ok) {
        return null;
      }

      const user = await upsertViewer(slackUser.user.id, 'createNonceRequest');
      const nonceRequest = await createNonceRequest(user.id);

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

      return nonceRequest;
    },
  }),
);
