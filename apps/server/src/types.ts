import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session } from 'express-session';
import { Redis } from 'ioredis';

type RequestType = Request & {
  session: Session & { userId: string };
};

export type ApolloContextType = {
  em: EntityManager<PostgreSqlDriver>;
  redis: Redis;
  req: RequestType;
  res: Response;
};
