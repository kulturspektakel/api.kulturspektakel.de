import prismaClient from '../../utils/prismaClient';
import totp from 'totp-generator';
import {SlackSlashCommandRequest} from './token';
import {sendMessage, SlackChannel} from '../../utils/slack';
import {Hono} from 'hono';

const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.parseBody<SlackSlashCommandRequest>();
  const accounts = await prismaClient.twoFactor.findMany();

  const matchingAccounts = accounts.filter(
    (a) => a.account.toLocaleLowerCase() === body.text.trim().toLowerCase(),
  );

  if (matchingAccounts.length === 1) {
    const response = await generateTwoFactorCodeResponse(
      body.user_name,
      matchingAccounts[0],
    );
    return c.json(response, 200);
  }

  c.json(
    {
      text: 'Für welchen Account möchtest du einen 2-Faktor-Code generieren?',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Hier kannst du dir einen 2-Faktor-Code generieren um dich in einen geteilten Kult-Account einzuloggen.',
          },
        },
        ...accounts.map((a) => ({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${a.account}* (${a.service})`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Code generieren',
            },
            value: `${a.account}@${a.service}`,
            action_id: 'two-factor-code',
          },
        })),
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: 'Generierte Codes sind nur für dich sichtbar und 30 Sekunden lang gültig. Es ist für alle sichbar, dass du dir einen Code generiert hast.',
            },
          ],
        },
      ],
    },
    200,
  );
});

export async function generateTwoFactorCodeResponse(
  userId: string,
  {
    secret,
    account,
    service,
  }: {
    secret: string;
    account: string;
    service: string;
  },
) {
  const code = totp(secret);

  await sendMessage({
    channel: SlackChannel.dev,
    text: `<@${userId}> hat einen 2-Faktor-Code für ${account} (${service}) generiert.`,
  });

  return {
    text: `2-Faktor-Code für ${account} (${service}): ${code}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `2-Faktor-Code für *${account}* (${service}): \`${code}\``,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: 'Der Code ist für 30 Sekunden gültig.',
            emoji: true,
          },
        ],
      },
    ],
  };
}

export default app;
