import {allItems} from '../utils/nuclino';
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
    updatedItems.map((item) =>
      sendMessage({
        channel: SlackChannel.wiki,
        text: `<${item.url}|${item.title}> aktualisiert`,
      }),
    ),
  );
}
