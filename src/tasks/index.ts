import {run, makeWorkerUtils, WorkerUtils, TaskSpec} from 'graphile-worker';
import env from '../utils/env';
import facebookLikes from './facebookLikes';
import instagramFollower from './instagramFollower';
import nuclinoUpdateMessage from './nuclinoUpdateMessage';
import gmailReminder from './gmailReminder';
import events from './taskEvents';
import {SlackChannel} from '../utils/slack';

const taskListProd = {
  nuclinoUpdateMessage,
  gmailReminder,
};

const taskList = {
  ...taskListProd,
  // These jobs are only executed in dev environment
  facebookLikes,
  instagramFollower,
};

export default async function () {
  return run({
    connectionString: env.DATABASE_URL,
    concurrency: 1,
    taskList: (env.NODE_ENV === 'production' ? taskListProd : taskList) as any,
    events,
    crontab: [
      '*/5 * * * * nuclinoUpdateMessage ?max=1',
      `30 10 * * * gmailReminder ?max=1 ${JSON.stringify({
        account: 'booking@kulturspektakel.de',
        channel: SlackChannel.dev,
        afterDays: [2, 5],
      })}`,
    ].join('\n'),
  });
}

type Payload<T extends keyof typeof taskList> = Parameters<
  typeof taskList[T]
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
      connectionString: env.DATABASE_URL,
    }));

  return workerUtils.addJob(identifier, payload, spec);
};
