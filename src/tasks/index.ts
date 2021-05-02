import {Schedule} from 'graphile-scheduler/dist/upsertSchedule';
import {run} from 'graphile-scheduler';
import env from '../utils/env';
import clearPendingReservations from './clearPendingReservations';

export default async function () {
  const taskList = {
    clearPendingReservations,
  };

  const schedules: Array<Schedule & {taskIdentifier: keyof typeof taskList}> = [
    {
      name: 'clearPendingReservations',
      pattern: '*/10 * * * *', // every 10 miuntes
      timeZone: 'Europe/London',
      taskIdentifier: 'clearPendingReservations',
    },
  ];

  run({
    connectionString: env.DATABASE_URL,
    concurrency: 1,
    taskList,
    schedules,
  });
}
