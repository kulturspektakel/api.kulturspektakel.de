import {EventEmitter} from 'events';
import {WorkerEvents} from 'graphile-worker';
import * as Sentry from '@sentry/node';
import {restart} from '.';

const emitter: WorkerEvents = new EventEmitter();

emitter.addListener('job:error', ({error, job, worker}) => {
  Sentry.captureException(error, {
    extra: {
      payload: job.payload,
    },
    tags: {kind: job.task_identifier},
  });
});

emitter.addListener('worker:fatalError', restart);

[
  'pool:listen:error' as const,
  'pool:listen:release' as const,
  'pool:release' as const,
  'pool:gracefulShutdown' as const,
  'pool:forcefulShutdown' as const,
  'worker:fatalError' as const,
  'gracefulShutdown' as const,
  'forcefulShutdown' as const,
].map((e) => emitter.addListener(e, () => console.error('worker_log', e)));

export default emitter;
