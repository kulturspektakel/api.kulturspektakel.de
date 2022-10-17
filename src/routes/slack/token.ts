import prismaClient from '../../utils/prismaClient';
import express, {Request} from 'express';
import {isPast} from 'date-fns';
import {ApiError} from '../../utils/errorReporting';
import {Prisma, Viewer} from '@prisma/client';
import {setCookie} from '../auth';
import {Router} from '@awaitjs/express';
import nuclinoTokenGeneration from '../../utils/nuclinoTokenGeneration';

const router = Router({});

router.postAsync(
  '/token',
  // @ts-ignore postAsync is not typed correctly
  express.urlencoded(),
  async (
    req: Request<
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
    >,
    res,
  ) => {
    res.send('ok');
    await nuclinoTokenGeneration(req.body.user_id, req.body.response_url);
  },
);

router.getAsync(
  '/token',
  async (
    req: Request<any, any, any, {nonce?: string; redirect?: string}>,
    res,
  ) => {
    const {nonce, redirect} = req.query;
    if (!nonce) {
      throw new ApiError(400, 'Missing nonce');
    }

    let viewer: Viewer | null = null;
    try {
      const {createdFor, expiresAt} = await prismaClient.nonce.delete({
        where: {nonce},
        select: {
          createdFor: true,
          expiresAt: true,
        },
      });
      viewer = createdFor;
      if (isPast(expiresAt)) {
        throw new ApiError(400, 'Nonce invalid');
      }
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new ApiError(400, 'Nonce invalid');
      } else {
        throw e;
      }
    }

    if (!viewer) {
      throw new ApiError(404, 'User not found');
    }

    setCookie(req, res, viewer.id);
    if (redirect) {
      res.redirect(redirect);
    }
  },
);

export default router;
