import jwt from 'jsonwebtoken';
import env from '../utils/env';
import {createHash} from 'crypto';
import prismaClient from '../utils/prismaClient';
import {ownTracksPassword} from './owntracks';
import {MiddlewareHandler} from 'hono';
import {getCookie} from 'hono/cookie';
import {parse as parseBasicAuth} from 'basic-auth';
import {Context} from '../context';

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

const middleware: MiddlewareHandler<{Variables: Context}> = async (c, next) => {
  const {req} = c;
  const basicUser = parseBasicAuth(c.req.header('authorization') ?? '');
  const sessionToken = getCookie(c, 'directus_session_token');

  if (basicUser && ownTracksPassword(basicUser.name) === basicUser.pass) {
    // OwnTracks
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
    // Contactless v2 device
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
  } else if (req.header('x-esp8266-sta-mac') != null) {
    // Contactless v1 device
    const [_, token] =
      // ESPhttpUpdate.setAuthorization prefixes auth header with "Basic " :-/
      req.header('authorization')?.match(/^(?:Basic )?Bearer (.+)$/) ?? [];
    const deviceId = req.header('x-esp8266-sta-mac')!.substring(9);
    if (token === sha1(`${deviceId}${env.CONTACTLESS_SALT}`)) {
      c.set('parsedToken', {
        iat: -1,
        exp: -1,
        iss: 'device',
        deviceId,
      });
    }
  } else if (sessionToken != null) {
    // Directus session token
    try {
      c.set(
        'parsedToken',
        jwt.verify(sessionToken, env.JWT_SECRET) as ParsedToken,
      );
    } catch (e) {}
  }

  return await next();
};

export default middleware;
