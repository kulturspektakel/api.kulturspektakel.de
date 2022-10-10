import {JobHelpers} from 'graphile-worker';
import notEmpty from '../utils/notEmpty';
import {item} from '../utils/nuclino';
import {unfurl} from '../utils/slack';

export default async function (
  {
    links,
    channel,
    ts,
  }: {
    links: Array<{domain: string; url: string}>;
    channel: string;
    ts: string;
  },
  {logger}: JobHelpers,
) {
  const unfurls = await Promise.all(
    links.map(async ({domain, url}) => {
      let blocks = null;
      switch (domain) {
        case 'app.nuclino.com':
          blocks = await unfurlNuclinoLink(url);
          break;
      }
      if (blocks) {
        return {url, blocks};
      }
    }),
  );
  await unfurl({
    channel,
    ts,
    unfurls: unfurls
      .filter(notEmpty)
      .reduce<Record<string, Object>>((acc, {url, blocks}) => {
        acc[url] = blocks;
        return acc;
      }, {}),
  });
}

async function unfurlNuclinoLink(url: string) {
  const match = url.match(
    /https:\/\/app\.nuclino\.com\/([^\/]+)\/([^\/]+)\/.+([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
  );

  if (match && match.length === 4) {
    const nuclinoItem = await item(match[3]);

    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `**<${nuclinoItem.url}|${nuclinoItem.title}>**`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Login',
              emoji: true,
            },
          },
        },
      ],
    };
  }
}
