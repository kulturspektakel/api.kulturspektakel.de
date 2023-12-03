import {Hono} from 'hono';
import schema from './pothos/schema';
import env from './utils/env';
import auth, {ParsedToken} from './routes/auth';
import slackInteraction from './routes/slack/interaction';
import slackToken from './routes/slack/token';
import slackEvents from './routes/slack/events';
import slackTwoFactor from './routes/slack/twofactor';
import slackOwntracks from './routes/slack/owntracks';
import {join} from 'path';
import tasks from './tasks';
import kultCash from './routes/kultCash';
import {ApiError} from './utils/errorReporting';
import saml from './routes/saml';
import owntracks from './routes/owntracks';
import * as Sentry from '@sentry/node';
import slackLagerschluessel from './routes/slack/lagerschluessel';
import {createYoga} from 'graphql-yoga';
import {useSentry} from '@envelop/sentry';
import {Context} from './context';
import {sentry} from '@hono/sentry';
import '@sentry/tracing';
import {serveStatic} from 'hono/bun';
import type {Serve} from 'bun';

// await tasks();
const app = new Hono<{Variables: Context}>();

// The request handler must be the first middleware on the app
app.use(
  '*',
  sentry({
    environment: env.NODE_ENV,
    enabled: env.NODE_ENV === 'production',
    dsn: env.SENTRY_DNS,
    tracesSampleRate: 1.0,
  }),
);

// Routes
app.use('*', auth);
// app.use('/slack', slackInteraction);
// app.use('/slack', slackToken);
// app.use('/slack', slackEvents);
// app.use('/slack', slackOwntracks);
// app.use('/slack', slackTwoFactor);
// app.use('/slack', slackLagerschluessel);
// app.use('/saml', saml);
app.route('/owntracks', owntracks);
// app.use('/\\$\\$\\$', kultCash);
app.use('/public/*', serveStatic({root: 'artifacts'}));

const yoga = createYoga<{}, Context>({
  schema,
  graphiql: {
    title: 'Kulturspektakel API',
  },
  // context: (initialContext) => {
  //   return {parsedToken: (initialContext as any).req._parsedToken};
  // },
  plugins: [
    useSentry({
      skipError: () => false,
    }),
  ],
});
app.use(yoga.graphqlEndpoint, (context) =>
  yoga.handle(context.req, context.var),
);

app.onError((error, c) => {
  if (error instanceof ApiError) {
    Sentry.withScope((scope) => {
      scope.addEventProcessor(async (event) =>
        Sentry.addRequestDataToEvent(event, c.req),
      );
      Sentry.captureException(error.originalError ?? error);
    });
    return c.text(error.message, error.code);
  }

  // mask internal server errors
  return c.text('Internal Server Error', 500);
});

console.log(`🚀 Server ready at http://localhost:${env.PORT}`);

export default {
  port: env.PORT,
  fetch: app.fetch,
} satisfies Serve;
