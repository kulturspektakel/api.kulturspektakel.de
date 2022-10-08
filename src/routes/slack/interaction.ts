import express, {Request} from 'express';
import router from './index';

router.postAsync(
  '/token',
  // @ts-ignore postAsync is not typed correctly
  express.json(),
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
  ) => {},
);
