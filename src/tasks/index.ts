import {run, makeWorkerUtils, WorkerUtils, TaskSpec} from 'graphile-worker';
import env from '../utils/env';
import facebookLikes from './facebookLikes';
import instagramFollower from './instagramFollower';
import nuclinoUpdateMessage from './nuclinoUpdateMessage';
import nonceInvalidate from './nonceInvalidate';
import spotifyListeners from './spotifyListeners';
import gmailReminder from './gmailReminder';
import events from './taskEvents';
import unfurlLink from './unfurlLink';
import bandApplicationDistance from './bandApplicationDistance';
import slackMessage from './slackMessage';
import bandApplicationDemo from './bandApplicationDemo';
import gmailSubscription from './gmailSubscription';
import nonceRequestInvalidate from './nonceRequestInvalidate';

const taskList = {
  nuclinoUpdateMessage,
  gmailReminder,
  nonceInvalidate,
  unfurlLink,
  bandApplicationDistance,
  slackMessage,
  bandApplicationDemo,
  facebookLikes,
  instagramFollower,
  spotifyListeners,
  gmailSubscription,
  nonceRequestInvalidate,
};

export default async function () {
  return run({
    connectionString: env.DIRECT_URL,
    concurrency: 1,
    taskList: taskList as any,
    events,
    crontab: [
      '*/5 * * * * nuclinoUpdateMessage ?max=1',
      `0 0 * * * gmailSubscription ?id=booking&fill=1d&max=3 {"account":"booking@kulturspektakel.de"}`,
      `0 0 * * * gmailSubscription ?id=info&fill=1d&max=3 {"account":"info@kulturspektakel.de"}`,
      `0 0 * * * gmailSubscription ?id=lager&fill=1d&max=3 {"account":"lager@kulturspektakel.de"}`,
    ].join('\n'),
  });
}

type Payload<T extends keyof typeof taskList> = Parameters<
  (typeof taskList)[T]
>[0];

let _workerUtils: WorkerUtils | null = null;
export const scheduleTask = async <T extends keyof typeof taskList>(
  identifier: T,
  payload: Payload<T>,
  spec?: TaskSpec | undefined,
) => {
  const workerUtils =
    _workerUtils ??
    (await makeWorkerUtils({
      connectionString: env.DIRECT_URL,
    }));

  return workerUtils.addJob(identifier, payload, {
    maxAttempts: 1,
    ...spec,
  });
};

await scheduleTask('gmailSubscription', {
  account: 'booking@kulturspektakel.de',
});
