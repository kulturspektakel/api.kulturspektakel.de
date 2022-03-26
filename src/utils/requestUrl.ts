import {URL} from 'url';
import {Request} from 'express';

export default function requestUrl(req: Request): URL {
  return new URL(
    `${req.headers['x-forwarded-proto'] ?? req.protocol}://${req.get('host')}${
      // using originalUrl to work with router prefixes
      req.originalUrl
    }`,
  );
}
