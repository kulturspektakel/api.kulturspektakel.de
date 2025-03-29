import {NonceRequestStatus} from '@prisma/client';
import nuclinoTokenGeneration from '../../utils/nuclinoTokenGeneration';
import prismaClient from '../../utils/prismaClient';
import {generateTwoFactorCodeResponse} from './twofactor';
import {Hono} from 'hono';
import {
  assignCrewCard,
  showCrewCardAssignmentModal,
} from '../../utils/crewCardEnrollment';

const app = new Hono();

type SlackInteractionPayload = {
  is_enterprise_install: false;
  api_app_id: string;
  enterprise: null;
  response_urls: [];
  team: {
    id: string;
    domain: string;
  };
  token: string;
  trigger_id: string;
  user: {
    username: string;
    id: string;
    name: string;
    team_id: string;
  };
};

type SlackActionPayload = {
  action_ts: string;
  block_id: string;
};

type SlackButtonAction = SlackActionPayload & {
  type: 'button';
  action_id:
    | 'approve-nonce-request'
    | 'reject-nonce-request'
    | 'nuclino-login-open'
    | 'nuclino-login-generation'
    | 'two-factor-code'
    | 'assign-crew-card'
    | 'assign-crew-card-modal';
  value?: string;
  text: {
    type: 'plain_text';
    text: string;
    emoji: true;
  };
};

type SlackUserSelectAction = SlackActionPayload & {
  type: 'users_select';
  action_id: 'users_select-action';
  selected_user: string;
};

type SlackBlockActionPayload = SlackInteractionPayload & {
  type: 'block_actions';
  actions: Array<SlackButtonAction | SlackUserSelectAction>;
  response_url: string;
};

type SlackViewSubmissionPayload = SlackInteractionPayload & {
  type: 'view_submission';
  view: {
    id: string;
    private_metadata?: string;
    state: {
      values: {
        [key: string]: {
          [key: string]:
            | {
                type: 'plain_text_input';
                value: string;
              }
            | {
                type: 'users_select';
                selected_user: string;
              };
        };
      };
    };
    hash: '1740933023.oqsYrm1A';
    callback_id: 'assign-crew-card';
    clear_on_close: false;
    close: {
      type: 'plain_text';
      text: 'Abbrechen';
      emoji: true;
    };
    previous_view_id: null;
    root_view_id: 'V08FAR1DAHM';
    type: 'modal';
    title: {
      type: 'plain_text';
      text: 'CrewCard zuordnen';
      emoji: true;
    };
    app_id: 'A01TQ6K148Y';
    external_id: '';
    app_installed_team_id: 'T03EKSJKF';
    notify_on_close: false;
    team_id: 'T03EKSJKF';
    submit: {
      type: 'plain_text';
      text: 'OK';
      emoji: true;
    };
    bot_id: 'B0258JE76A2';
  };
};

app.post('/', async (c) => {
  const body = await c.req.parseBody<{
    payload: string;
  }>();
  const payload: SlackBlockActionPayload | SlackViewSubmissionPayload =
    JSON.parse(body.payload);

  switch (payload.type) {
    case 'block_actions': {
      const [action] = payload.actions ?? [];
      switch (action.action_id) {
        case 'approve-nonce-request':
        case 'reject-nonce-request': {
          await prismaClient.nonceRequest.update({
            where: {
              id: action.value,
              expiresAt: {
                gt: new Date(),
              },
            },
            data: {
              status:
                action.action_id === 'approve-nonce-request'
                  ? NonceRequestStatus.Approved
                  : NonceRequestStatus.Rejected,
            },
          });

          await fetch(payload.response_url, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              delete_original: 'true',
            }),
          })
            .then((res) => res.json())
            .catch(console.error);

          return c.text('ok', 200);
        }
        case 'nuclino-login-generation': {
          await nuclinoTokenGeneration(
            payload.user.id,
            payload.trigger_id,
            action.value,
          );
          return c.text('ok', 200);
        }
        case 'nuclino-login-open': {
          return c.json(
            {
              response_action: 'clear',
            },
            200,
          );
        }
        case 'two-factor-code': {
          if (!action.value) {
            return c.text('Invalid input', 400);
          }
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
          await fetch(payload.response_url, {
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

          return c.text('ok', 200);
        }
        case 'assign-crew-card-modal': {
          if (!action.value) {
            return c.text('Invalid input', 400);
          }
          await showCrewCardAssignmentModal(
            action.value,
            payload.trigger_id,
            payload.response_url,
          );
          return c.text('ok', 200);
        }
        case 'users_select-action': {
          return c.text('ok', 200);
        }
        default: {
          console.error('Unknown action', action);
          return c.text('ok', 200);
        }
      }
    }
    case 'view_submission': {
      switch (payload.view.callback_id) {
        case 'assign-crew-card': {
          const values = Object.values(payload.view.state.values).flatMap(
            Object.values,
          );
          const slackUserId = values.find(
            (value) => value.type === 'users_select',
          )?.selected_user;

          const nonSlackUser = values.find(
            (value) => value.type === 'plain_text_input',
          )?.value;

          await assignCrewCard(
            slackUserId,
            nonSlackUser,
            payload.user.id,
            payload.view.private_metadata!,
          );

          return c.json({
            response_action: 'clear',
          });
        }
      }
    }
    default: {
      console.error('Unknown payload', payload);
      return c.text('ok', 200);
    }
  }
});

export default app;
