import express from 'express';
import {ApolloServer} from '@apollo/server';
import schema from './pothos/schema';
import {Context} from './context';
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
import {ApolloServerPluginLandingPageGraphQLPlayground} from '@apollo/server-plugin-landing-page-graphql-playground';
import {
  ApiError,
  ApolloErrorLoggingPlugin,
  errorReportingMiddleware,
} from './utils/errorReporting';
import saml from './routes/saml';
import owntracks from './routes/owntracks';
import * as Sentry from '@sentry/node';
import {RewriteFrames as RewriteFramesIntegration} from '@sentry/integrations';
import {GraphQLError} from 'graphql';
import {expressMiddleware} from '@apollo/server/express4';
import {json} from 'body-parser';
import cors from 'cors';
import {ApolloServerErrorCode} from '@apollo/server/errors';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import slackLagerschluessel from './routes/slack/lagerschluessel';

const GRAPHQL_PATH = '/graphql';

(async () => {
  await tasks();
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer<Context>({
    schema,
    formatError: (err) => {
      if (!(err instanceof GraphQLError)) {
        return new GraphQLError(err.message, {
          extensions: {
            code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          },
          originalError: err as Error,
        });
      }
      return err;
    },
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer}),
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          'request.credentials': 'include',
        },
      }),
      ApolloErrorLoggingPlugin,
    ],
  });

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
    ],
  });
  app.use(Sentry.Handlers.requestHandler());

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

  app.use(
    Sentry.Handlers.errorHandler({
      // ApiErrors are handled in errorReportingMiddleware
      shouldHandleError: (error) => !(error instanceof ApiError),
    }),
  );
  app.use(errorReportingMiddleware);

  await server.start();

  app.use(
    GRAPHQL_PATH,
    cors<cors.CorsRequest>({
      origin: [
        'http://localhost:3000',
        'https://crew.kulturspektakel.de',
        'https://www2.kulturspektakel.de',
        'https://app.kulturspektakel.de',
        'https://kulturspektakel.de',
        'https://booking.kulturspektakel.de',
      ],
      credentials: true,
    }),
    json(),
    // @ts-ignore
    expressMiddleware(server, {
      context: async ({req}) => ({parsedToken: req._parsedToken}),
    }),
  );

  httpServer.listen({port: env.PORT}, () =>
    console.log(
      `🚀 Server ready at http://localhost:${env.PORT}${GRAPHQL_PATH}`,
    ),
  );
})();
