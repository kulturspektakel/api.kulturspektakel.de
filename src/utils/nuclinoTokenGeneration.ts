import {URL} from 'url';
import {slackApiRequest} from './slack';
import env from './env';
import createNonce from './createNonce';
import {upsertViewer} from './upsertViewer';

export default async function nuclinoTokenGeneration(
  userId: string,
  trigger_id: string,
  redirectUrl = 'https://app.nuclino.com/Kulturspektakel/General',
) {
  const user = await upsertViewer(userId, 'nuclionTokenGeneration');
  const nonce = await createNonce(user.id);

  const nuclinoSsoUrl = new URL(
    `https://api.nuclino.com/api/sso/${env.NUCLINO_TEAM_ID}/login`,
  );
  nuclinoSsoUrl.searchParams.append('redirectUrl', redirectUrl);
  const url = new URL('https://api.kulturspektakel.de/slack/token');
  url.searchParams.append('nonce', nonce);
  url.searchParams.append('redirect', nuclinoSsoUrl.toString());

  const response = await slackApiRequest('views.open', {
    trigger_id,
    view: {
      type: 'modal',
      callback_id: 'nuclino-login',
      title: {
        type: 'plain_text',
        text: 'Nuclino Login',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Falls du nicht bei Nuclino eingeloggt bist, klicke auf den Button um dich einzuloggen.`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Einloggen und Nuclino öffnen',
                emoji: true,
              },
              url: url.toString(),
              value: url.toString(),
              action_id: 'nuclino-login-open',
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: 'Der Button funktioniert nur einmalig und 5 Minuten lang. Danach muss der Dialog geschlossen und erneut geöffnet werden.',
              emoji: true,
            },
          ],
        },
      ],
    },
  });

  if (!response.ok) {
    throw new Error(response.error);
  }
}
