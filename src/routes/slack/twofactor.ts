import prismaClient from '../../utils/prismaClient';
import express from 'express';
import {Router} from '@awaitjs/express';
import totp from 'totp-generator';
import {SlackSlashCommandRequest} from './token';
import {sendMessage, slackApiRequest, SlackChannel} from '../../utils/slack';

const router = Router({});

router.postAsync(
  '/twofactor',
  // @ts-ignore postAsync is not typed correctly
  express.urlencoded(),
  async (req: SlackSlashCommandRequest, res) => {
    const accounts = await prismaClient.twoFactor.findMany();

    const matchingAccounts = accounts.filter(
      (a) =>
        a.account.toLocaleLowerCase() === req.body.text.trim().toLowerCase(),
    );

    if (matchingAccounts.length === 1) {
      const response = await generateTwoFactorCodeResponse(
        req.body.user_name,
        matchingAccounts[0],
      );
      return res.status(200).json(response);
    }

    res.status(200).send();

    const response = await slackApiRequest('views.open', {
      trigger_id: req.body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'two-factor',
        title: {
          type: 'plain_text',
          text: '2-Faktor-Code',
        },
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
    });

    if (!response.ok) {
      throw new Error(response.error);
    }
  },
);

export async function generateTwoFactorCodeResponse(
  username: string,
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
    text: `${username} hat einen 2-Faktor-Code für ${account} (${service}) generiert.`,
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

export default router;
