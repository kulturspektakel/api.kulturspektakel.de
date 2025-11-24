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

export default emitter;
