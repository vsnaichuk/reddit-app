import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';

export const appDataSource = new DataSource({
  type: 'postgres',
  database: 'reddit',
  synchronize: true,
  logging: true,
  entities: [User, Post],
});
