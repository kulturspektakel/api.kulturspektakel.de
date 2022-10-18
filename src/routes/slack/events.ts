import {Router} from '@awaitjs/express';
import express, {Request} from 'express';
import {scheduleTask} from '../../tasks';

const router = Router({});

router.postAsync(
  '/events',
  // @ts-ignore postAsync is not typed correctly
  express.json(),
  async (
    req: Request<
      any,
      any,
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
    >,
    res,
  ) => {
    switch (req.body.type) {
      case 'url_verification':
        return res.json({challenge: req.body.challenge});
      case 'event_callback':
        switch (req.body.event.type) {
          case 'link_shared':
            await scheduleTask(
              'unfurlLink',
              {
                links: req.body.event.links,
                channel: req.body.event.channel ?? '',
                ts: req.body.event.message_ts ?? '',
              },
              {maxAttempts: 1},
            );
            return res.status(200);
        }
    }
  },
);

export default router;
