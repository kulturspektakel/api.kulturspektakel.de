import {Router} from '@awaitjs/express';
import express, {Request} from 'express';
import nuclinoTokenGeneration from '../../utils/nuclinoTokenGeneration';
import UnreachableCaseError from '../../utils/UnreachableCaseError';

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
        payload: string;
      }
    >,
    res,
  ) => {
    console.log(req.body);
    const payload: {
      type: 'interactive_message';
      actions: Array<{
        name: string;
        type: 'button';
        value: string;
        block_id?: string;
        action_id: 'nuclino-login-generation' | 'nuclino-login-open';
      }>;
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
    } = JSON.parse(req.body.payload);
    const [action] = payload.actions ?? [];
    if (action) {
      switch (action.action_id) {
        case 'nuclino-login-generation':
          res.send('ok');
          await nuclinoTokenGeneration(
            payload.user.id,
            payload.response_url,
            action.value,
          );
          return;
        case 'nuclino-login-open':
          return res.json({});
        default:
          throw new UnreachableCaseError(action.action_id);
      }
    }

    res.status(404).send('Not found');
  },
);

export default router;
