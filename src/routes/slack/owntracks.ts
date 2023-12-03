import prismaClient from '../../utils/prismaClient';
import {SlackSlashCommandRequest} from './token';
import {configString} from '../owntracks';
import {Hono} from 'hono';

const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.parseBody<SlackSlashCommandRequest>();
  const viewer = await prismaClient.viewer.upsert({
    create: {
      displayName: body.user_name,
      email: '',
    },
    update: {},
    where: {
      id: body.user_id,
    },
  });

  return c.json(
    {
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
    },
    200,
  );
});

export default app;
