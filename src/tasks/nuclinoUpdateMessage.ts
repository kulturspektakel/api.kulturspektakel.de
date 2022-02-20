import {allItems} from '../utils/nuclino';
import {sendMessage, SlackChannel} from '../utils/slack';
import {isAfter, sub} from 'date-fns';
import {JobHelpers} from 'graphile-worker';

export default async function (_: undefined, {logger}: JobHelpers) {
  const items = await allItems();
  const updatedItems = items.filter(
    (r) =>
      r.object === 'item' &&
      // edited in last 3 minutes
      isAfter(new Date(r.lastUpdatedAt), sub(new Date(), {minutes: 3})),
  );

  logger.info(`Nuclino updates ${updatedItems.length}`);
  await Promise.all(
    items.map((item) =>
      sendMessage({
        channel: SlackChannel.wiki,
        text: `<${item.url}|${item.title}> aktualisiert`,
      }),
    ),
  );
}
