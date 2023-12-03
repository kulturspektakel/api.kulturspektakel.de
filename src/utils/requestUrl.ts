import {URL} from 'url';
import {HonoRequest} from 'hono';

export default function requestUrl(req: HonoRequest): URL {
  const url = new URL(req.raw.url);
  const proto = req.header('x-forwarded-proto');
  if (proto) {
    url.protocol = proto;
  }
  return url;
}
