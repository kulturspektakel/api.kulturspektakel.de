import {sendMessage, slackApiRequest, SlackChannel} from './slack';
import prisma from './prismaClient';
import {upsertViewer} from './upsertViewer';
import {subDays} from 'date-fns';

export async function sendCrewCardEnrollmentMessage(
  cardIdBytes: Uint8Array,
  validUntil: Date,
) {
  const cardId = Array.from(cardIdBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(':')
    .toUpperCase();

  const formattedDate = subDays(validUntil, 1).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Berlin',
  });

  await sendMessage({
    text: `CrewCard ${cardId} wurde aktiviert`,
    channel: SlackChannel.crewcards,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `CrewCard \`${cardId}\` wurde bis einschließlich ${formattedDate} aktiviert`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Karte zuordnen',
              emoji: true,
            },
            value: cardId,
            action_id: 'assign-crew-card-modal',
          },
        ],
      },
    ],
  });
}

export async function showCrewCardAssignmentModal(
  cardId: string,
  triggerId: string,
  responseUrl: string,
) {
  const response = await slackApiRequest('views.open', {
    trigger_id: triggerId,
    view: {
      callback_id: 'assign-crew-card',
      private_metadata: JSON.stringify({responseUrl, cardId}),
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'CrewCard zuordnen',
        emoji: true,
      },
      submit: {
        type: 'plain_text',
        text: 'OK',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: 'Abbrechen',
        emoji: true,
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Die CrewCard \`${cardId}\` muss einer Person zugeordnet werden.`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Slack-User:*',
          },
          accessory: {
            type: 'users_select',
            placeholder: {
              type: 'plain_text',
              text: 'User',
              emoji: true,
            },
            action_id: 'users_select-action',
          },
        },
        {
          type: 'input',
          optional: true,
          element: {
            type: 'plain_text_input',
            action_id: 'crew-card-holder-name',
            placeholder: {
              type: 'plain_text',
              text: 'Vorname Nachname',
              emoji: true,
            },
          },
          label: {
            type: 'plain_text',
            text: 'oder Person ohne Slack-Account:',
            emoji: true,
          },
        },
      ],
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error(response.error);
  }
}

export async function assignCrewCard(
  slackUserId: string | null,
  nonSlackUser: string | null,
  assignedByUserId: string,
  privateMetadata: string,
) {
  if (!slackUserId && !nonSlackUser) {
    throw new Error('No user provided');
  }

  const {
    responseUrl,
    cardId,
  }: {
    responseUrl: string;
    cardId: string;
  } = JSON.parse(privateMetadata);

  let viewerId = null;
  let nickname = null;
  if (slackUserId) {
    const viewer = await upsertViewer(slackUserId, 'crewCardEnrollment');
    viewerId = viewer.id;
  } else if (nonSlackUser) {
    nickname = nonSlackUser;
  } else {
    throw new Error('No user provided');
  }

  const crewCard = await prisma.crewCard.update({
    where: {
      id: new Uint8Array(cardId.split(':').map((part) => parseInt(part, 16))),
    },
    data: {
      viewerId,
      nickname,
    },
  });

  const formattedDate = crewCard.validUntil.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Berlin',
  });

  await fetch(responseUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      replace_original: 'true',
      text: `CrewCard \`${cardId}\` erfolgreich zugeordnet`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<@${assignedByUserId}> hat die CrewCard \`${cardId}\` ${slackUserId ? `<@${slackUserId}>` : `_${nonSlackUser}_`} zugeordnet. Gültig bis einschließlich ${formattedDate}.`,
          },
        },
      ],
    }),
  })
    .then((res) => res.json())
    .catch(console.error);
}
