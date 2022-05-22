import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Post } from './entities/Post';
import mikroConfig from './mikro-orm.config';

const init = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroConfig);

  await orm.getMigrator().up();

  const post = orm.em.create(Post, { title: 'my first post' });
  await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {});
  console.log(posts);
};

init();
