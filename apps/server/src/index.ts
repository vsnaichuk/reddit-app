import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';

import { COOKIE_NAME, __prod__ } from './constants';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { appDataSource } from './appDataSource';

(async () => {
  appDataSource.initialize();

  // init app
  const app = express();

  // helps to resolve X-Forwarded-* header fields
  app.set('trust proxy', true);

  // setup cors
  app.use(
    cors({
      origin: [
        'https://studio.apollographql.com',
        'https://localhost:4001/graphql',
        'http://localhost:3000',
      ],
      credentials: true,
    }),
  );

  // init redis
  const redis = new Redis();
  const RedisStore = connectRedis(session);

  // uses express-session to manage cookies
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
        disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: true, // means that only works on https
        // sameSite: 'lax', // lax - balance between security and usability
        sameSite: 'none', // 'none' - to work with apollo sandbox
      },
      resave: false,
      saveUninitialized: false,
      secret: 'l123sasda131kdfjRANDOMa123adj123haSECRET3f',
    }),
  );

  // init apollo
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
    // This will allow POST operations from any client and GET operations from Apollo
    // Client Web, Apollo iOS, and Apollo Kotlin.
    csrfPrevention: true,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false, // we using cors package instead
  });

  // for testing
  // app.get('/', (_, res) => {
  //   res.send('hello');
  // });

  app.listen(4001, () => {
    console.log('server started');
  });
})().catch(console.error);
