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

const server = new ApolloServer({
  context,
  schema,
  formatError: (err) => {
    if (!(err instanceof ApolloError)) {
      return new ApolloError(err.message);
    }
    return err;
  },
  introspection: true,
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
});

(async () => {
  await tasks();
  const app = express();
  app.use(cookieParser());

  // Routes
  auth(app);
  passkit(app);
  ics(app);
  kultCash(app);
  app.use(
    '/public',
    express.static(join(__dirname, '..', 'artifacts', 'public')),
  );
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
