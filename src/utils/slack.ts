import env from './env';

export enum SlackChannel {
  dev = 'C93K75X61',
  bandbewerbungen = 'C3U99AB54',
  wiki = 'C03F5E07Z',
  booking = 'C3KKL3727',
  vorstand = 'G03HP9QM2',
  dj = 'C0491HCU5G9',
  lager = 'C03LJF6P36E',
  bookingmails = 'C06M4CM6D99',
}

export type SlackApiUser = {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  profile: {
    avatar_hash: string;
    status_text: string;
    status_emoji: string;
    real_name: string;
    display_name: string;
    real_name_normalized: string;
    display_name_normalized: string;
    email: string;
    image_original: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    team: string;
  };
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  updated: 1502138686;
  is_app_user: boolean;
  has_2fa: boolean;
};

export async function sendMessage({
  ...body
}: {
  channel: SlackChannel;
  text: string;
  username?: string;
  icon_emoji?: string;
  blocks?: Array<any>;
  attachments?: Array<any>;
  unfurl_links?: boolean;
}) {
  const res = await slackApiRequest('chat.postMessage', body);

  if (!res.ok) {
    throw res.error;
  }
}

export async function fetchUser(user: string) {
  const res = await slackApiRequest<{
    user: SlackApiUser;
  }>(`users.info?user=${user}`);
  if (!res.ok) {
    console.error(res);
    return;
  }

  return res.user;
}

export async function slackApiRequest<T>(
  endpoint: string,
  body?: Object,
): Promise<
  | {
      ok: false;
      error: 'user_not_found';
    }
  | ({
      ok: true;
    } & T)
> {
  const res = await fetch(`https://slack.com/api/${endpoint}`, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      'Content-type': 'application/json; charset=utf-8',
    },
  }).then((res) => res.json());

  return res;
}

export async function unfurl(body: {
  channel: string;
  ts: string;
  unfurls: Object;
}) {
  const res = await slackApiRequest('chat.unfurl', body);

  if (!res.ok) {
    console.error(res);
  }
}
