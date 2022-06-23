import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { MikroORM } from '@mikro-orm/core';
import { buildSchema } from 'type-graphql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

(async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroConfig);
  const migrator = orm.getMigrator();
  await migrator.up(); // runs migrations up to the latest

  const app = express();

  app.set('trust proxy', true);

  const redisClient = new Redis();
  const RedisStore = connectRedis(session);

  // Uses express-session to manage cookies
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

  const apolloServer = new ApolloServer({
    csrfPrevention: true, // see below for more about this
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
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [
        'https://studio.apollographql.com',
        'https://localhost:4001/graphql',
      ],
      credentials: true,
    },
  });

  app.get('/', (_, res) => {
    res.send('hello');
  });

  app.listen(4001, () => {
    console.log('serv started');
  });
})().catch(console.error);
