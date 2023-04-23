import jwt from 'jsonwebtoken';
import env from '../utils/env';
import fetch from 'node-fetch';
import {Router} from '@awaitjs/express';
import {createHash} from 'crypto';

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
    };

const router = Router({});

const sha1 = (data: string) => createHash('sha1').update(data).digest('hex');

router.use(async (req, res, next) => {
  let [_, token] =
    // ESPhttpUpdate.setAuthorization prefixes auth header with "Basic " :-/
    req.headers.authorization?.match(/^(?:Basic )?Bearer (.+)$/) ?? [];

  if (token == null && req.cookies.directus_refresh_token != null) {
    const refresher = await fetch(
      'https://cms.kulturspektakel.de/auth/refresh',
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
    token = refresher?.data?.access_token;
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
