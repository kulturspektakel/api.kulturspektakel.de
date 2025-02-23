import {SlackSlashCommandRequest} from './token';
import {Hono} from 'hono';
import addToMailingList from '../../utils/addToMailingList';

const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.parseBody<SlackSlashCommandRequest>();
  const email = body.text.trim().toLowerCase();
  if (!email) {
    return c.json(
      {
        text: '⚠️ Ungültiges Slash-Command. Email-Adresse fehlt!',
      },
      200,
    );
  }
  const added = await addToMailingList(email);

  return c.json(
    {
      text: added
        ? `${email} wurde zur Mailingliste orga@kulturspektakel.de hinzugefügt`
        : `${email} ist bereits in der Mailingliste orga@kulturspektakel.de`,
    },
    200,
  );
});

export default app;
