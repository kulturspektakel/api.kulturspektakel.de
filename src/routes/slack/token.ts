import express, {Request} from 'express';
import {Router} from '@awaitjs/express';
import nuclinoTokenGeneration from '../../utils/nuclinoTokenGeneration';

const router = Router({});

export type SlackSlashCommandRequest = Request<
  any,
  any,
  {
    token: string;
    team_id: string;
    team_domain: string;
    enterprise_id?: string;
    enterprise_name?: string;
    channel_id: string;
    channel_name: string;
    user_id: string;
    user_name: string;
    command: string;
    text: string;
    response_url: string;
    trigger_id: string;
    api_app_id: string;
  }
>;

router.postAsync(
  '/token',
  // @ts-ignore postAsync is not typed correctly
  express.urlencoded(),
  async (req: SlackSlashCommandRequest, res) => {
    res.status(200).send();
    await nuclinoTokenGeneration(req.body.user_id, req.body.trigger_id);
  },
);

export default router;
