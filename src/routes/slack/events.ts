import {Router} from '@awaitjs/express';
import express, {Request} from 'express';

const router = Router({});

router.postAsync(
  '/events',
  // @ts-ignore postAsync is not typed correctly
  express.json(),
  async (
    req: Request<
      any,
      any,
      {
        token: string;
        challenge: string;
        type: string;
      }
    >,
    res,
  ) => {
    console.log(req.body);
    res.json({challenge: req.body.challenge});
  },
);

export default router;
