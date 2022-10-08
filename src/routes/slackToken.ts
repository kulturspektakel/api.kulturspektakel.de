import prismaClient from '../utils/prismaClient';
import env from '../utils/env';
import express, {Request} from 'express';
import {URL} from 'url';
import {add, isPast} from 'date-fns';
import {ApiError} from '../utils/errorReporting';
import {scheduleTask} from '../tasks';
import {fetchUser} from '../utils/slack';
import {Prisma, Viewer} from '@prisma/client';
import {setCookie} from './auth';
import {Router} from '@awaitjs/express';

const router = Router({});

router.postAsync(
  '/slack-token',
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
    const slackUser = await fetchUser(req.body.user_id);
    if (!slackUser) {
      throw new ApiError(404, 'User not found');
    }

    const userData = {
      displayName: slackUser.profile.real_name,
      profilePicture: slackUser.profile.image_192,
      email: slackUser.profile.email,
    };
    const user = await prismaClient.viewer.upsert({
      create: userData,
      update: userData,
      where: {
        id: slackUser.id,
      },
    });

    const expiresAt = add(new Date(), {minutes: 5});
    const nonce = await prismaClient.nonce.create({
      data: {
        createdForId: user.id,
        expiresAt,
      },
    });
    await scheduleTask(
      'nonceInvalidate',
      {nonce: nonce.nonce},
      {
        runAt: expiresAt,
      },
    );

    const nuclinoSsoUrl = new URL(
      `https://api.nuclino.com/api/sso/${env.NUCLINO_TEAM_ID}/login`,
    );
    nuclinoSsoUrl.searchParams.append(
      'redirectUrl',
      'https://app.nuclino.com/Kulturspektakel/General',
    );
    const url = new URL('https://api.kulturspektakel.de/slack-token');
    url.searchParams.append('nonce', nonce.nonce);
    url.searchParams.append('redirect', nuclinoSsoUrl.toString());

    return res.json({
      response_type: 'ephemeral',
      text: `<${url.toString()}|Nuclino Login-Link für ${
        user.displayName
      }> (der Link ist 5 Minuten lang gültig)`,
    });
  },
);

router.getAsync(
  '/slack-token',
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
