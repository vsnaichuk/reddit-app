import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session } from 'express-session';

type RequestType = Request & {
  session: Session & { userId: string };
};

export type ApolloContextType = {
  em: EntityManager<PostgreSqlDriver>;
  req: RequestType;
  res: Response;
};
