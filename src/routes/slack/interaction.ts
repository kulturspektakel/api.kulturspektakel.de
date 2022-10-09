import {Router} from '@awaitjs/express';
import express, {Request} from 'express';

const router = Router({});

router.postAsync(
  '/interaction',
  // @ts-ignore postAsync is not typed correctly
  express.urlencoded(),
  async (
    req: Request<
      any,
      any,
      {
        payload: {
          type: 'block_actions';
          user: string;
          trigger_id: string;
          response_url: string;
        };
      }
    >,
    res,
  ) => {
    console.log(req.body);
    res.send('ok');
  },
);

export default router;
