import {EventEmitter} from 'events';
import {WorkerEvents} from 'graphile-worker';
import * as Sentry from '@sentry/node';

const emitter: WorkerEvents = new EventEmitter();

emitter.addListener('job:error', ({error, job, worker}) => {
  Sentry.captureException(error, {
    extra: {
      payload: job.payload,
    },
    tags: {kind: job.task_identifier},
  });
});
export default emitter;
