import {EventEmitter} from 'events';
import {WorkerEvents} from 'graphile-worker';
import {restart} from '.';

const emitter: WorkerEvents = new EventEmitter();

[
  'job:error' as const,
  'pool:listen:error' as const,
  'pool:listen:release' as const,
  'pool:release' as const,
  'pool:gracefulShutdown' as const,
  'pool:forcefulShutdown' as const,
  'worker:fatalError' as const,
  'gracefulShutdown' as const,
  'forcefulShutdown' as const,
].map((e) =>
  emitter.addListener(e, async (data) => {
    console.error(`[graphile-worker] ${e}}`, data);
    if (e === 'gracefulShutdown' || e === 'forcefulShutdown') {
      console.error(`[graphile-worker] triggering restart after ${e}`);
      await restart(e);
    }
  }),
);

emitter.addListener('job:complete', async ({job}) => {
  const duration = new Date().getTime() - job.run_at.getTime();
  console.log(
    `[graphile-worker] job:complete ${job.task_identifier} ${job.id} duration=${Math.round(duration / 1000)}s `,
  );
});

export default emitter;
