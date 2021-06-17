import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';
import {sendMessage, SlackChannel} from '../utils/slack';

export default async function ({id}: {id: number}, {logger}: JobHelpers) {
  const reservation = await prismaClient.reservation.findUnique({
    where: {
      id,
    },
    include: {
      table: {
        include: {
          area: true,
        },
      },
    },
  });
  if (!reservation) {
    return;
  }

  await sendMessage({
    channel: SlackChannel.dev,
    text: `Reservierung #${reservation.id} bestätigt`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `Reservierung #${reservation.id}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Bereich:* ${reservation.table.area.displayName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Personen:* ${reservation.otherPersons.length + 1}`,
          },
          {
            type: 'mrkdwn',
            text: `*Tag:* ${reservation.startTime.toLocaleDateString('de-DE', {
              weekday: 'long',
              timeZone: 'Europe/Berlin',
            })}`,
          },
          {
            type: 'mrkdwn',
            text: `*Uhrzeit:* ${reservation.startTime.toLocaleTimeString(
              'de-DE',
              {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Berlin',
              },
            )} - ${reservation.endTime.toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Berlin',
            })}`,
          },
        ],
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Bearbeiten',
          },
          url: `https://table.kulturspektakel.de/reservation/${reservation.token}`,
          value: 'click_me_123',
          action_id: 'button-action',
        },
      },
    ],
  });
}
