import fetch from 'node-fetch';
import env from './env';

export enum SlackChannel {
  dev = 'C93K75X61',
  bandbewerbungen = 'C3U99AB54',
  wiki = 'C03F5E07Z',
}

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
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      'Content-type': 'application/json; charset=utf-8',
    },
  }).then((res) => res.json());

  if (!res.ok) {
    console.error(res);
  }
}
