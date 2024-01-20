import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import {add} from 'date-fns';
import {SlackApiUser, slackApiRequest} from '../utils/slack';
import uuid from '@braintree/uuid';
import {NonceRequestStatus} from '@prisma/client';

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

      const nonceRequestId = uuid();

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
                value: nonceRequestId,
              },
              {
                type: 'button',
                style: 'danger',
                text: {
                  type: 'plain_text',
                  text: 'Ablehnen',
                },
                action_id: 'reject-nonce-request',
                value: nonceRequestId,
              },
            ],
          },
        ],
      });

      const data = {
        email: slackUser.user.profile.email,
        displayName:
          slackUser.user.profile.real_name ??
          slackUser.user.profile.display_name,
        profilePicture: slackUser.user.profile.image_192,
      };
      const user = await prismaClient.viewer.upsert({
        where: {
          id: slackUser.user.id,
        },
        create: data,
        update: data,
      });

      const nonceRequest = await prismaClient.nonceRequest.create({
        data: {
          id: nonceRequestId,
          expiresAt: add(new Date(), {minutes: 5}),
          status: NonceRequestStatus.Pending,
          createdFor: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return nonceRequest.id;
    },
  }),
);
