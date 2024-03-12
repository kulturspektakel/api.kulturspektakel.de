import jwt from 'jsonwebtoken';
import env from '../utils/env';
import {createHash} from 'crypto';
import requestUrl from '../utils/requestUrl';
import prismaClient from '../utils/prismaClient';
import {ownTracksPassword} from './owntracks';
import {MiddlewareHandler} from 'hono';
import {getCookie, setCookie} from 'hono/cookie';
import {parse as parseBasicAuth} from 'basic-auth';

export type ParsedToken =
  | {
      iat: number;
      exp: number;
      iss: 'device';
      deviceId: string;
    }
  | {
      id: string;
      role: string;
      app_access: boolean;
      admin_access: boolean;
      iat: number;
      exp: number;
      iss: 'directus';
    }
  | {
      viewerId: string;
      iss: 'owntracks';
    };

const sha1 = (data: string) => createHash('sha1').update(data).digest('hex');

const middleware: MiddlewareHandler = async (c, next) => {
  const {req} = c;
  let [_, token] =
    // ESPhttpUpdate.setAuthorization prefixes auth header with "Basic " :-/
    req.header('authorization')?.match(/^(?:Basic )?Bearer (.+)$/) ?? [];

  if (token == null && getCookie(c, 'directus_refresh_token') != null) {
    const refresher = await fetch(
      'https://crew.kulturspektakel.de/auth/refresh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          refresh_token: getCookie(c, 'directus_refresh_token'),
          mode: 'json',
        }),
      },
    )
      .then((res) => res.json())
      .catch(() => null);
    if (refresher?.data) {
      token = refresher.data.access_token;
      // update used directus_refresh_token in cookie
      setCookie(c, 'directus_refresh_token', refresher.data.refresh_token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: requestUrl(req).hostname.split('.').slice(-2).join('.'),
        secure: true,
        httpOnly: true,
        sameSite: 'None',
      });
    }
  }

  const basicUser = parseBasicAuth(c.req.header('authorization') ?? '');
  if (basicUser && ownTracksPassword(basicUser.name) === basicUser.pass) {
    const viewer = await prismaClient.viewer.findUnique({
      where: {
        id: basicUser.name,
      },
    });
    if (viewer != null) {
      c.set('parsedToken', {
        viewerId: viewer.id,
        iss: 'owntracks',
      });
    }
  } else if (
    basicUser &&
    req.header('user-agent')?.startsWith('Contactless/') &&
    basicUser.pass === sha1(basicUser.name + env.CONTACTLESS_SALT)
  ) {
    c.set('parsedToken', {
      iat: -1,
      exp: -1,
      iss: 'device',
      deviceId: basicUser.name,
    });
    return await next();
  }

  if (token == null) {
    return await next();
  }

  if (req.header('x-esp8266-sta-mac') != null) {
    // Contactless device
    const id = req.header('x-esp8266-sta-mac')!.substring(9);
    if (token === sha1(`${id}${env.CONTACTLESS_SALT}`)) {
      c.set('parsedToken', {
        iat: -1,
        exp: -1,
        iss: 'device',
        deviceId: id,
      });
    }

    return await next();
  }

  try {
    c.set('parsedToken', jwt.verify(token, env.JWT_SECRET) as ParsedToken);
  } catch (e) {}

  return await next();
};

export default middleware;
