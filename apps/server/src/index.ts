import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { PRODUCTION } from './constants';

const init = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroConfig);
  const migrator = orm.getMigrator();
  await migrator.up(); // runs migrations up to the latest

  const app = express();

  const RedisStore = connectRedis(session);
  let redisClient = new Redis();

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        // TODO: Only for dev
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax', // protection
        secure: PRODUCTION, // cookie will work in https
      },
      saveUninitialized: false,
      // TODO: Add to env
      secret: 'keyboard cat',
      resave: false,
    }),
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.get('/', (_, res) => {
    res.send('hello');
  });

  app.listen(4000, () => {
    console.log('serv started');
  });
};

init();
