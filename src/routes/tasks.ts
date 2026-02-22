import {Hono} from 'hono';
import {restart} from '../tasks';
import prismaClient from '../utils/prismaClient';

const app = new Hono();

app.get('/restart', async (c) => {
  await restart();
  return c.json({message: 'Tasks restarted successfully'});
});

app.get('/pending', async (c) => {
  const [{count}] = await prismaClient.$queryRaw<
    [{count: bigint}]
  >`SELECT COUNT(*) as count
    FROM graphile_worker.jobs
    WHERE run_at < NOW()
      AND locked_at IS NULL
      AND attempts < max_attempts`;

  const restarted = count > 0;
  if (restarted) {
    await restart();
  }

  return c.json({restarted});
});

export default app;
