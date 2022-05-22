import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { PRODUCTION } from './constants';
import path from 'path';
import { Post } from './entities/Post';
import { User } from './entities/User';

const mikroConfig: Options<PostgreSqlDriver> = {
  allowGlobalContext: true,
  migrations: {
    path: path.join(__dirname, './migrations'),
  },
  entities: [Post, User],
  type: 'postgresql',
  dbName: 'reddit',
  debug: !PRODUCTION,
  // If you create username and pass
  // user: '',
  // password: '',
};

export default mikroConfig;
