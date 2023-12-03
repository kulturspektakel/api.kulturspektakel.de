import {Hono} from 'hono';
import {scheduleTask} from '../../tasks';

const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.json<
    | {
        token: string;
        challenge: string;
        type: 'url_verification';
      }
    | {
        token: string;
        team_id: string;
        api_app_id: string;
        event: {
          type: 'link_shared';
          user: string;
          channel?: string;
          message_ts?: string;
          links: Array<{
            domain: string;
            url: string;
          }>;
          source: 'conversations_history' | 'composer';
          unfurl_id: string;
          is_bot_user_member: boolean;
          event_ts: string;
        };
        type: 'event_callback';
        event_id: string;
        event_time: number;
        authorizations: Array<{
          enterprise_id: null;
          team_id: string;
          user_id: string;
          is_bot: boolean;
          is_enterprise_install: boolean;
        }>;
        is_ext_shared_channel: boolean;
        event_context: string;
      }
  >();
  switch (body.type) {
    case 'url_verification':
      return c.json({challenge: body.challenge});
    case 'event_callback':
      switch (body.event.type) {
        case 'link_shared':
          await scheduleTask(
            'unfurlLink',
            {
              links: body.event.links,
              channel: body.event.channel ?? '',
              ts: body.event.message_ts ?? '',
            },
            {maxAttempts: 1},
          );
          return c.status(200);
      }
  }
});

export default app;
