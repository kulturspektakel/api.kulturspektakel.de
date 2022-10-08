import prismaClient from '../utils/prismaClient';
import jwt from 'jsonwebtoken';
import env from '../utils/env';
import express, {Request, Response} from 'express';
import {URL} from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';
import {add, isPast} from 'date-fns';
import {ApiError} from '../utils/errorReporting';
import {Router} from '@awaitjs/express';
import requestUrl from '../utils/requestUrl';
import {scheduleTask} from '../tasks';
import {fetchUser} from '../utils/slack';
import {Prisma, Viewer} from '@prisma/client';

export type TokenInput =
  | {
      type: 'user';
      userId: string;
    }
  | {
      type: 'device';
      deviceId: string;
    };

export type ParsedToken = TokenInput & {
  iat: number;
  exp: number;
};

function parseToken(token?: string): ParsedToken | null {
  try {
    if (token && jwt.verify(token, env.JWT_SECRET)) {
      return jwt.decode(token) as ParsedToken;
    }
  } catch (e) {}
  return null;
}

function cookieDomain(req: Request): string {
  return requestUrl(req).hostname.split('.').slice(-2).join('.');
}

function setCookie(req: Request, res: Response, userId: string) {
  const expiresIn = 60 * 60 * 24 * 30;

  const tokenInput: TokenInput = {
    type: 'user',
    userId,
  };

  const token = jwt.sign(tokenInput, env.JWT_SECRET, {
    expiresIn,
  });
  res.cookie('token', token, {
    maxAge: expiresIn * 1000,
    domain: cookieDomain(req),
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return token;
}

const SCOPES = ['identity.basic', 'identity.email', 'identity.avatar'];
const router = Router({});

router.getAsync('/logout', async (req, res) => {
  res.clearCookie('token', {
    domain: cookieDomain(req),
  });
  res.redirect('https://kulturspektakel.de');
});

router.getAsync(
  '/auth',
  async (req: Request<any, any, any, {code?: string; state?: string}>, res) => {
    const redirectURI = requestUrl(req);
    redirectURI.search = '';

    if (req.query.code != null) {
      const form = new FormData();
      form.append('client_id', env.SLACK_CLIENT_ID);
      form.append('client_secret', env.SLACK_CLIENT_SECRET);
      form.append('code', req.query.code);
      form.append('redirect_uri', redirectURI.toString());

      const data: {
        ok: boolean;
        error?: string;
        access_token: string;
        scope: string;
        user_id: string;
        team_id: string;
        team_name: string;
      } = await fetch('https://slack.com/api/oauth.access', {
        method: 'POST',
        body: form,
      }).then((res) => res.json());

      if (!data.ok) {
        throw new ApiError(401, data.error ?? 'Slack oauth.access failed');
      }

      const data2: {
        ok: boolean;
        error?: string;
        user: {
          image_192: string;
          email: string;
          name: string;
          id: string;
        };
      } = await fetch(`https://slack.com/api/users.identity`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }).then((res) => res.json());

      if (!data2.ok) {
        throw new ApiError(401, data2.error ?? 'Slack users.identity failed');
      }

      const payload = {
        displayName: data2.user.name,
        slackToken: data.access_token,
        profilePicture: data2.user.image_192,
        email: data2.user.email,
        slackScopes: SCOPES,
      };

      const user = await prismaClient.viewer.upsert({
        create: {
          id: data.user_id,
          ...payload,
        },
        update: payload,
        where: {
          id: data.user_id,
        },
      });

      const token = setCookie(req, res, user.id);
      if (req.query.state) {
        const u = new URL(decodeURIComponent(req.query.state));
        u.searchParams.append('token', token);
        return res.redirect(302, u.toString());
      }
      res.send(token);
      return;
    }

    const url = new URL('https://slack.com/oauth/authorize');
    url.searchParams.append('client_id', env.SLACK_CLIENT_ID);
    url.searchParams.append('scope', SCOPES.join(' '));
    url.searchParams.append('team', env.SLACK_TEAM_ID);
    url.searchParams.append('redirect_uri', redirectURI.toString());
    if (req.query.state) {
      url.searchParams.append('state', encodeURIComponent(req.query.state));
    }
    res.redirect(302, url.toString());
  },
);

router.use((req, res, next) => {
  const auth = req.headers.authorization?.match(/^Bearer (.+)$/) ?? [];
  const token = parseToken(req.cookies.token ?? auth[1]);
  // @ts-ignore: put token on request object so it can be used elsewhere
  req._token = token;

  if (token?.type === 'user') {
    // extend cookie lifetime, if necessary
    const renewal = add(new Date(), {days: 7}).getTime();
    if (token.exp * 1000 < renewal) {
      setCookie(req, res, token.userId);
    }
  }

  next();
});

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
      text: `<${url.toString()}|Nuclino Login-Link für ${user.displayName}> ${
        req.body.user_name
      } (der Link ist 5 Minuten lang gültig)`,
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
