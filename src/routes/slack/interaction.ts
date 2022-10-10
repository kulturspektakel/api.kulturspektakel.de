import {Router} from '@awaitjs/express';
import express, {Request} from 'express';

const router = Router({});

router.postAsync(
  '/interaction',
  // @ts-ignore postAsync is not typed correctly
  express.urlencoded(),
  async (
    req: Request<
      any,
      any,
      {
        payload: {
          type: 'interactive_message';
          actions: Array<{name: string; type: 'button'; value: string}>;
          callback_id: string;
          team: {id: string; domain: string};
          channel: {id: string; name: string};
          user: {id: string; name: string};
          action_ts: string;
          message_ts: string;
          attachment_id: string;
          token: string;
          is_app_unfurl: boolean;
          enterprise: null;
          is_enterprise_install: boolean;
          response_url: string;
          trigger_id: string;
        };
      }
    >,
    res,
  ) => {
    console.log(req.body);
    res.send('ok');
  },
);

export default router;
