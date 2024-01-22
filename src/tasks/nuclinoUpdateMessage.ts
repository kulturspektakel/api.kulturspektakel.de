import {allItems, user} from '../utils/nuclino';
import {sendMessage, SlackChannel} from '../utils/slack';
import {isAfter, sub, isBefore} from 'date-fns';
import {JobHelpers} from 'graphile-worker';

export default async function (_: undefined, {logger}: JobHelpers) {
  const updatedItems = (await allItems()).filter(
    (r) =>
      r.object === 'item' &&
      // edited in the last 10 minutes
      isAfter(new Date(r.lastUpdatedAt), sub(new Date(), {minutes: 10})) &&
      // edited at least 5 minutes ago
      isBefore(new Date(r.lastUpdatedAt), sub(new Date(), {minutes: 5})),
  );

  logger.info(`Nuclino updates ${updatedItems.length}`);

  // limit to 3 items, to not spam
  updatedItems.length = 3;

  await Promise.all(
    updatedItems.map(async (item) => {
      const lastUpdatedUser = await user(item.lastUpdatedUserId);
      const url = item.url.replace(
        'https://app.nuclino.com/t/',
        'https://app.nuclino.com/Kulturspektakel/',
      );
      return sendMessage({
        channel: SlackChannel.wiki,
        text: `<${url}|${item.title}> von ${lastUpdatedUser.firstName} ${lastUpdatedUser.lastName} aktualisiert`,
        unfurl_links: false,
      });
    }),
  );
}
