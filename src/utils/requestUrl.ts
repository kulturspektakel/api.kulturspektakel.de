import {URL} from 'url';
import {HonoRequest} from 'hono';

export default function requestUrl(req: HonoRequest): URL {
  return new URL(
    `${req.header('x-forwarded-proto') ?? req.protocol}://${req.get('host')}${
      // using originalUrl to work with router prefixes
      req.originalUrl
    }`,
  );
}
