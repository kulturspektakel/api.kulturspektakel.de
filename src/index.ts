import express from 'express';
import schema from './pothos/schema';
import env from './utils/env';
import cookieParser from 'cookie-parser';
import auth from './routes/auth';
import slackInteraction from './routes/slack/interaction';
import slackToken from './routes/slack/token';
import slackEvents from './routes/slack/events';
import slackTwoFactor from './routes/slack/twofactor';
import slackOwntracks from './routes/slack/owntracks';
import {join} from 'path';
import tasks from './tasks';
import kultCash from './routes/kultCash';
import {ApiError, errorReportingMiddleware} from './utils/errorReporting';
import saml from './routes/saml';
import owntracks from './routes/owntracks';
import * as Sentry from '@sentry/node';
import {RewriteFrames as RewriteFramesIntegration} from '@sentry/integrations';
import slackLagerschluessel from './routes/slack/lagerschluessel';
import {createYoga} from 'graphql-yoga';
import {useSentry} from '@envelop/sentry';
import {Context} from './context';
import '@sentry/tracing';

(async () => {
  await tasks();
  const app = express();

  // The request handler must be the first middleware on the app
  Sentry.init({
    environment: env.NODE_ENV,
    enabled: env.NODE_ENV === 'production',
    dsn: env.SENTRY_DNS,
    release: env.RELEASE, // needs to match release name set in github action main.yml
    integrations: [
      new RewriteFramesIntegration({
        root: __dirname,
      }),
      new Sentry.Integrations.Http({tracing: true}),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(cookieParser());

  // Routes
  app.use(auth);
  app.use('/slack', slackInteraction);
  app.use('/slack', slackToken);
  app.use('/slack', slackEvents);
  app.use('/slack', slackOwntracks);
  app.use('/slack', slackTwoFactor);
  app.use('/slack', slackLagerschluessel);
  app.use('/saml', saml);
  app.use('/owntracks', owntracks);
  app.use('/\\$\\$\\$', kultCash);
  app.use(
    '/public',
    express.static(join(__dirname, '..', 'artifacts', 'public')),
  );

  const yoga = createYoga<{}, Context>({
    schema,
    graphiql: {
      title: 'Kulturspektakel API',
    },
    context: (initialContext) => {
      return {parsedToken: (initialContext as any).req._parsedToken};
    },
    plugins: [
      useSentry({
        skipError: () => false,
      }),
    ],
  });
  app.use(yoga.graphqlEndpoint, yoga);

  app.use(
    Sentry.Handlers.errorHandler({
      // ApiErrors are handled in errorReportingMiddleware
      shouldHandleError: (error) => !(error instanceof ApiError),
    }),
  );
  app.use(errorReportingMiddleware);
  app.listen({port: env.PORT}, () =>
    console.log(`🚀 Server ready at http://localhost:${env.PORT}`),
  );
})();
