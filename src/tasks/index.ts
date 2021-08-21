import {run, makeWorkerUtils, WorkerUtils, TaskSpec} from 'graphile-worker';
import env from '../utils/env';
import clearPendingReservations from './clearPendingReservations';
import reservationSlackMessage from './reservationSlackMessage';
import facebookLikes from './facebookLikes';
import instagramFollower from './instagramFollower';

const taskListProd = {
  clearPendingReservations,
  reservationSlackMessage,
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
