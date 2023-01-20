import {JobHelpers} from 'graphile-worker';
import {sendMessage} from '../utils/slack';

export default async function (
  body: Parameters<typeof sendMessage>[0],
  {logger}: JobHelpers,
) {
  await sendMessage(body);
}
