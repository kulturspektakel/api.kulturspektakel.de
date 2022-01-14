import env from '../utils/env';
import {sendMessage, SlackChannel} from '../utils/slack';

export default async function ({
  cellId,
  cellTitle,
  user,
}: {
  cellId: string;
  cellTitle: string;
  user: string;
}) {
  await sendMessage({
    channel: SlackChannel.wiki,
    text: `<https://app.nuclino.com/${env.NUCLINO_TEAM_ID}/General/${cellId}|${cellTitle}> von ${user} aktualisiert`,
  });
}
