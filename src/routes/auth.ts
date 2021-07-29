import prismaClient from '../utils/prismaClient';
import jwt from 'jsonwebtoken';
import env from '../utils/env';
import {Express, Request, Response} from 'express';
import {URL} from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';
import {add, endOfDay} from 'date-fns';

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

function requestURL(req: Request): URL {
  return new URL(
    `${req.headers['x-forwarded-proto'] ?? req.protocol}://${req.get('host')}`,
  );
}

function cookieDomain(req: Request): string {
  return requestURL(req).hostname.split('.').slice(-2).join('.');
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

export default function (app: Express) {
  app.use((req, res, next) => {
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

  app.get('/logout', (req, res) => {
    res.clearCookie('token', {
      domain: cookieDomain(req),
    });
    res.redirect('https://kulturspektakel.de');
  });

  app.get<{}, any, any, {code?: string; state?: string}>(
    '/auth',
    async (req, res) => {
      const redirectURI = requestURL(req);
      redirectURI.pathname = req.originalUrl.split('?').shift()!;
      /*
      if (parseToken(req.cookies.token)) {
        // valid token
        return res.send('ok');
      } else 
      */
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
          return res.send(data.error);
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
          return res.send(data2.error);
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
          const u = new URL(req.query.state);
          u.searchParams.append('token', token);
          return res.redirect(302, req.query.state);
        }
        return res.send(token);
      }

      const url = new URL('https://slack.com/oauth/authorize');
      url.searchParams.append('client_id', env.SLACK_CLIENT_ID);
      url.searchParams.append('scope', SCOPES.join(' '));
      url.searchParams.append('redirect_uri', redirectURI.toString());
      url.searchParams.append('state', req.headers['referer'] ?? '');
      res.redirect(302, url.toString());
    },
  );
}
