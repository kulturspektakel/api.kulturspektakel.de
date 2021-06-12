import {run, makeWorkerUtils, WorkerUtils, TaskSpec} from 'graphile-worker';
import env from '../utils/env';
import clearPendingReservations from './clearPendingReservations';

const taskList = {
  clearPendingReservations,
};

export default async function () {
  run({
    connectionString: env.DATABASE_URL,
    concurrency: 1,
    taskList: taskList as any,
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

  workerUtils.addJob(identifier, payload, spec);
};
