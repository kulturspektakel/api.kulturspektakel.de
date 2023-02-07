import {
  run,
  makeWorkerUtils,
  WorkerUtils,
  TaskSpec,
  Logger,
} from 'graphile-worker';
import env from '../utils/env';
import facebookLikes from './facebookLikes';
import instagramFollower from './instagramFollower';
import nuclinoUpdateMessage from './nuclinoUpdateMessage';
import nonceInvalidate from './nonceInvalidate';
import gmailReminder, {booking, info} from './gmailReminder';
import events from './taskEvents';
import unfurlLink from './unfurlLink';
import bandApplicationDistance from './bandApplicationDistance';
import slackMessage from './slackMessage';
import bandApplicationDemo from './bandApplicationDemo';
import {Logging} from '@google-cloud/logging';

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
};

export const logger = new Logger((scope) => async (level, message) => {
  const logging = new Logging({
    projectId: 'gmail-reminder-api',
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    },
  });
  const log = logging.log('projects/gmail-reminder-api/logs/worker');
  let severity = 'DEFAULT';
  switch (level) {
    case 'warning':
      severity = 'WARNING';
      break;
    case 'debug':
      severity = 'DEBUG';
      break;
    case 'error':
      severity = 'ERROR';
      break;
    case 'info':
      severity = 'INFO';
      break;
  }

  const entry = log.entry(
    {
      resource: {
        type: 'generic_task',
      },
      labels: {
        instance_id: 'graphile-worker',
      },
      severity,
    },
    {...scope, message},
  );
  await log.write(entry);
});

export default async function () {
  return run({
    connectionString: env.DATABASE_URL,
    concurrency: 1,
    taskList: taskList as any,
    logger: env.NODE_ENV === 'production' ? logger : undefined,
    events,
    crontab: [
      '*/5 * * * * nuclinoUpdateMessage ?max=1',
      `30 9 * * * gmailReminder ?max=1&id=booking ${JSON.stringify(booking)}`,
      `0 8 * * * gmailReminder ?max=1&id=info ${JSON.stringify(info)}`,
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

  return workerUtils.addJob(identifier, payload, {
    maxAttempts: 1,
    ...spec,
  });
};
