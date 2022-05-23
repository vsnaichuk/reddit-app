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

const init = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroConfig);
  const migrator = orm.getMigrator();
  await migrator.up(); // runs migrations up to the latest

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({
      em: orm.em,
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
