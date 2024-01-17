import {MiddlewareHandler} from 'hono';
import prismaClient from './utils/prismaClient';

const middleware: MiddlewareHandler = async (c, next) => {
  if (!c.req.raw.headers.get('host')?.endsWith('kult.wiki')) {
    return next();
  }

  let slug = new URL(c.req.url).pathname;
  if (!slug.startsWith('/')) {
    // add leading slash
    slug = '/' + slug;
  }
  if (slug.endsWith('/') && slug.length > 1) {
    // remove trailing slash
    slug = slug.slice(0, -1);
  }

  const data = await prismaClient.shortDomainRedirect.findUnique({
    where: {
      slug,
    },
  });

  if (data == null) {
    return c.notFound();
  }
  return c.redirect(data.targetUrl, 302);
};

export default middleware;
