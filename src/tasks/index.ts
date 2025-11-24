import {
  run,
  makeWorkerUtils,
  WorkerUtils,
  TaskSpec,
  Runner,
} from 'graphile-worker';
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
import {sleep} from 'graphile-worker/dist/lib';
import badgeAwarded from './badgeAwarded';
import createMembershipApplication from './createMembershipApplication';
import sendEmail from './sendEmail';
import createBandApplication from './createBandApplication';
import {Pool} from 'pg';

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
  badgeAwarded,
  createMembershipApplication,
  sendEmail,
  createBandApplication,
};

let runner: Runner | null = null;

export async function restart(reason?: string) {
  console.log(`[graphile-worker]: restarting ${reason}`);
  try {
    await runner?.stop();
  } catch (e) {}
  await sleep(5000);
  await startRunner();
}

async function startRunner() {
  runner = await run({
    pgPool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10_000,
      log: console.log,
    }),
    concurrency: 5,
    taskList: taskList as any,
    noPreparedStatements: true,
    events,
    crontab: [
      '*/5 * * * * nuclinoUpdateMessage ?max=1&jobKey=nuclinoUpdateMessage&jobKeyMode=replace',
      `0 0 * * * gmailSubscription ?id=booking&fill=1d&max=3 {"account":"booking@kulturspektakel.de"}`,
      `0 0 * * * gmailSubscription ?id=info&fill=1d&max=3 {"account":"info@kulturspektakel.de"}`,
      `0 0 * * * gmailSubscription ?id=lager&fill=1d&max=3 {"account":"lager@kulturspektakel.de"}`,
    ].join('\n'),
  });
  if (runner) {
    console.log('[graphile-worker]: started');
  }
}

export default startRunner;

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

  return workerUtils.addJob(identifier, payload as any, {
    maxAttempts: 3,
    ...spec,
  });
};
