import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { MikroORM } from '@mikro-orm/core';
import { buildSchema } from 'type-graphql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';

import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

(async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroConfig);

  // runs migrations up to the latest
  const migrator = orm.getMigrator();
  await migrator.up();

  // init app
  const app = express();

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

  // helps to resolve X-Forwarded-* header fields
  app.set('trust proxy', true);

  // init redis
  const redisClient = new Redis();
  const RedisStore = connectRedis(session);

  // uses express-session to manage cookies
  app.use(
    session({
      name: 'qid',
      saveUninitialized: false,
      secret: 'l123sasda131kdfjRANDOMa123adj123haSECRET3f',
      resave: false,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      },
    }),
  );

  // init apollo
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
      redis: redisClient,
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
