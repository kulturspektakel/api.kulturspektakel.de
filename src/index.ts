import express from 'express';
import {ApolloServer, ApolloError} from 'apollo-server-express';
import schema from './schema';
import context from './context';
import env from './utils/env';
import cookieParser from 'cookie-parser';
import auth from './routes/auth';
import passkit from './routes/passkit';
import ics from './routes/ics';
import {join} from 'path';
import tasks from './tasks';
import kultCash from './routes/kultCash';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import {
  ApolloErrorLoggingPlugin,
  errorReportingMiddleware,
} from './utils/errorReporting';
import saml from './routes/saml';

const server = new ApolloServer({
  context,
  schema: schema as any, // nexus problem, probably fixed in next version
  formatError: (err) => {
    if (!(err instanceof ApolloError)) {
      const e = new ApolloError(err.message);
      // TODO: Check original error is not displayed buy logged
      e.originalError = err;
      return e;
    }
    return err;
  },
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: {
        'request.credentials': 'include',
      },
    }),
    ApolloErrorLoggingPlugin,
  ],
});

(async () => {
  await tasks();
  const app = express();
  app.use(cookieParser());

  // Routes
  app.use(auth);
  app.use('/paskit', passkit);
  app.use('/ics', ics);
  app.use('/saml', saml);
  app.use('/\\$\\$\\$', kultCash);
  app.use(
    '/public',
    express.static(join(__dirname, '..', 'artifacts', 'public')),
  );

  app.use(errorReportingMiddleware);

  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: [
        'http://localhost:3000',
        'https://crew.kulturspektakel.de',
        'https://kulturspektakel.de',
        'https://table.kulturspektakel.de',
        'https://booking.kulturspektakel.de',
      ],
      credentials: true,
    },
  });

  app.listen({port: env.PORT}, () =>
    console.log(
      `🚀 Server ready at http://localhost:${env.PORT}${server.graphqlPath}`,
    ),
  );
})();
