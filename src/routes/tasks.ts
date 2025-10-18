import {Hono} from 'hono';
import {restart} from '../tasks';

const app = new Hono();

app.get('/restart', async (c) => {
  await restart();
  return c.json({message: 'Tasks restarted successfully'});
});

export default app;
