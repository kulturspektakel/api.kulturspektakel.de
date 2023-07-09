import prismaClient from '../../utils/prismaClient';
import express from 'express';
import {Router} from '@awaitjs/express';
import {SlackSlashCommandRequest} from './token';
import {configString} from '../owntracks';

const router = Router({});

router.postAsync(
  '/owntracks',
  // @ts-ignore postAsync is not typed correctly
  express.urlencoded(),
  async (req: SlackSlashCommandRequest, res) => {
    const viewer = await prismaClient.viewer.upsert({
      create: {
        displayName: req.body.user_name,
        email: '',
      },
      update: {},
      where: {
        id: req.body.user_id,
      },
    });

    res.status(200).json({
      text: 'Für welchen Account möchtest du einen 2-Faktor-Code generieren?',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\n1. *OwnTracks* herunterladen: <https://apps.apple.com/de/app/owntracks/id692424691|iPhone> oder <https://play.google.com/store/apps/details?id=org.owntracks.android&hl=en&gl=US&pli=1|Android>\n2. Diesen <https://api.kulturspektakel.de/owntracks/config?config=${configString(
              viewer,
            )}|Link> anklicken um die App zu konfigurieren`,
          },
        },
      ],
    });
  },
);

export default router;
