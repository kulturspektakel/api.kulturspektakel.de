import nuclinoTokenGeneration from '../../utils/nuclinoTokenGeneration';
import {Hono} from 'hono';
import {setCookie} from 'hono/cookie';

const app = new Hono();

export type SlackSlashCommandRequest = {
  token: string;
  team_id: string;
  team_domain: string;
  enterprise_id?: string;
  enterprise_name?: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
  api_app_id: string;
};

app.get('/', async (c) => {
  setCookie(c, 'nonce', c.req.query('nonce')!, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 5 * 60 * 1000,
  });
  c.redirect(c.req.query('redirect')!);
});

app.post('/', async (c) => {
  const body = await c.req.parseBody<SlackSlashCommandRequest>();
  c.status(200);
  await nuclinoTokenGeneration(body.user_id, body.trigger_id);
});

export default app;
