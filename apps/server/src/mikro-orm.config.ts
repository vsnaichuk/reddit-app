import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { PRODUCTION } from './constants';
import { Post } from './entities/Post';
import path from 'path';

const mikroConfig: Options<PostgreSqlDriver> = {
  allowGlobalContext: true,
  migrations: {
    path: path.join(__dirname, './migrations'),
  },
  entities: [Post],
  type: 'postgresql',
  dbName: 'reddit',
  debug: !PRODUCTION,
  // If you create username and pass
  // user: '',
  // password: '',
};

export default mikroConfig;
