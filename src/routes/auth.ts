import prismaClient from '../utils/prismaClient';
import jwt from 'jsonwebtoken';
import env from '../utils/env';
import {Request, Response} from 'express';
import {URL} from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';
import {add} from 'date-fns';
import {ApiError} from '../utils/errorReporting';
import {Router} from '@awaitjs/express';
import requestUrl from '../utils/requestUrl';
import {Viewer} from '@prisma/client';
import {createHash} from 'crypto';

export type ParsedToken =
  | {
      iat: number;
      exp: number;
      iss: 'device';
      deviceId: string;
    }
  | {
      iat: number;
      exp: number;
      type: 'user';
      userId: string;
      iss: undefined;
    }
  | {
      id: string;
      role: string;
      app_access: boolean;
      admin_access: boolean;
      iat: number;
      exp: number;
      iss: 'directus';
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

export function setCookie(req: Request, res: Response, userId: string) {
  const expiresIn = 60 * 60 * 24 * 30;

  const tokenInput = {
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

const sha1 = (data: string) => createHash('sha1').update(data).digest('hex');

router.use(async (req, res, next) => {
  let [_, token] =
    // ESPhttpUpdate.setAuthorization prefixes auth header with "Basic " :-/
    req.headers.authorization?.match(/^(?:Basic )?Bearer (.+)$/) ?? [];

  if (token == null && req.cookies.token != null) {
    token = req.cookies.token;
  }

  if (token == null) {
    return next();
  }

  if (req.header('x-esp8266-sta-mac') != null) {
    // Contactless device
    const id = req.header('x-esp8266-sta-mac')!.substring(9);
    if (token === sha1(`${id}${env.CONTACTLESS_SALT}`)) {
      req._parsedToken = {
        iat: -1,
        exp: -1,
        iss: 'device',
        deviceId: id,
      };
    }

    return next();
  }

  try {
    req._parsedToken = jwt.verify(token, env.JWT_SECRET) as ParsedToken;
  } catch (e) {
    return next();
  }

  if (req._parsedToken.iss == null && req._parsedToken.type === 'user') {
    // old cookie
    // extend cookie lifetime, if necessary
    const renewal = add(new Date(), {days: 7}).getTime();
    if (req._parsedToken.exp * 1000 < renewal) {
      setCookie(req, res, req._parsedToken.userId);
    }
  }

  next();
});

export default router;
