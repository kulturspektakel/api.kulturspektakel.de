import {Hono} from 'hono';
import schema from './pothos/schema';
import env from './utils/env';
import auth from './routes/auth';
import tasks from './tasks';
import kultCash from './routes/kultCash';
import {ApiError} from './utils/errorReporting';
import saml from './routes/saml';
import owntracks from './routes/owntracks';
import slack from './routes/slack';
import {createYoga} from 'graphql-yoga';
import {useSentry} from '@envelop/sentry';
import {Context} from './context';
import {sentry} from '@hono/sentry';
import {serveStatic} from 'hono/bun';
import {cors} from 'hono/cors';

const app = new Hono<{Variables: Context}>();

// The request handler must be the first middleware on the app
app.use(
  '*',
  sentry({
    environment: env.NODE_ENV,
    enabled: env.NODE_ENV === 'production',
    dsn: env.SENTRY_DNS,
    requestDataOptions: {
      allowedHeaders: true,
      allowedSearchParams: true,
      allowedCookies: true,
    },
  }),
);

app.use('*', auth);
app.use(
  '*',
  cors({
    origin: [
      'https://kulturspektakel.de',
      'https://www.kulturspektakel.de',
      'https://www2.kulturspektakel.de',
      'https://crew.kulturspektakel.de',
      'https://booking.kulturspektakel.de',
      'https://app.kulturspektakel.de',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
);

// Routes
app.route('/slack', slack);
app.route('/saml', saml);
app.route('/owntracks', owntracks);
app.route('/$$$', kultCash);
app.use('/public/*', serveStatic({root: 'artifacts'}));
app.on(['GET', 'POST'], '/graphql', async (c) =>
  createYoga({
    schema,
    graphiql: {
      title: 'Kulturspektakel API',
      defaultQuery: ' ',
    },
    graphqlEndpoint: '',
    context: () => c.var,
    plugins: [
      useSentry({
        skipError: () => false,
      }),
    ],
  }).fetch(c.req.raw),
);

app.onError(async (error, c) => {
  console.error(error);
  try {
    const rawBody = await c.req.raw.body?.getReader().read();
    const body = new TextDecoder().decode(rawBody?.value);
    c.get('sentry').setRequestBody(body);
    c.get('sentry').setContext('body', {body});
  } catch (e) {}

  if (!(error instanceof ApiError)) {
    // mask internal server errors
    return c.text('Internal Server Error', 500);
  }
  return c.text(error.message, error.code);
});

Bun.serve({port: env.PORT, fetch: app.fetch});
console.log(`🚀 Server ready at http://localhost:${env.PORT}`);

await tasks();
