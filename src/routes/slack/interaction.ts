import nuclinoTokenGeneration from '../../utils/nuclinoTokenGeneration';
import prismaClient from '../../utils/prismaClient';
import UnreachableCaseError from '../../utils/UnreachableCaseError';
import {generateTwoFactorCodeResponse} from './twofactor';
import {Hono} from 'hono';

const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.parseBody<{
    payload: string;
  }>();
  const payload: {
    type: 'interactive_message';
    actions: Array<{
      name: string;
      type: 'button';
      value: string;
      block_id?: string;
      action_id:
        | 'nuclino-login-generation'
        | 'nuclino-login-open'
        | 'two-factor-code';
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
  } = JSON.parse(body.payload);

  const [action] = payload.actions ?? [];
  if (action) {
    switch (action.action_id) {
      case 'nuclino-login-generation':
        c.text('ok', 200);
        await nuclinoTokenGeneration(
          payload.user.id,
          payload.trigger_id,
          action.value,
        );
        return;
      case 'nuclino-login-open':
        return c.json(
          {
            response_action: 'clear',
          },
          200,
        );
      case 'two-factor-code':
        const value = action.value.split('@');
        const service = value.pop();
        const account = value.join('@');
        const twoFactor = await prismaClient.twoFactor.findFirstOrThrow({
          where: {
            service,
            account,
          },
        });
        const response = await generateTwoFactorCodeResponse(
          payload.user.id,
          twoFactor,
        );
        console.log(payload);
        const apiResponse = await fetch(payload.response_url, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            replace_original: 'true',
            ...response,
          }),
        })
          .then((res) => res.json())
          .catch(console.error);
        console.log(apiResponse);
        return;
      default:
        throw new UnreachableCaseError(action.action_id);
    }
  }

  return c.notFound();
});

export default app;
