import {URL} from 'url';
import {HonoRequest} from 'hono';

export default function requestUrl(req: HonoRequest): URL {
  console.log(req.raw);
  return new URL(req.raw.url);
}
