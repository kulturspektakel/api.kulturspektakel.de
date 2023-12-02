import jwt from 'jsonwebtoken';
import env from '../utils/env';
import {Router} from '@awaitjs/express';
import {createHash} from 'crypto';
import requestUrl from '../utils/requestUrl';
import basicAuth from 'basic-auth';
import prismaClient from '../utils/prismaClient';
import {ownTracksPassword} from './owntracks';

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

const router = Router({});

const sha1 = (data: string) => createHash('sha1').update(data).digest('hex');

router.use(async (req, res, next) => {
  let [_, token] =
    // ESPhttpUpdate.setAuthorization prefixes auth header with "Basic " :-/
    req.headers.authorization?.match(/^(?:Basic )?Bearer (.+)$/) ?? [];

  if (token == null && req.cookies.directus_refresh_token != null) {
    const refresher = await fetch(
      'https://crew.kulturspektakel.de/auth/refresh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          refresh_token: req.cookies.directus_refresh_token,
          mode: 'json',
        }),
      },
    )
      .then((res) => res.json())
      .catch(() => null);
    if (refresher?.data) {
      token = refresher.data.access_token;
      // update used directus_refresh_token in cookie
      res.cookie('directus_refresh_token', refresher.data.refresh_token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: requestUrl(req).hostname.split('.').slice(-2).join('.'),
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      });
    }
  }

  const basicUser = basicAuth(req);
  if (basicUser && ownTracksPassword(basicUser.name) === basicUser.pass) {
    const viewer = await prismaClient.viewer.findUnique({
      where: {
        id: basicUser.name,
      },
    });
    if (viewer != null) {
      req._parsedToken = {
        viewerId: viewer.id,
        iss: 'owntracks',
      };
    }
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
  } catch (e) {}

  next();
});

export default router;
