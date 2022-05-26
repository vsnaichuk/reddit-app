import {
  PostgreSqlDriver,
  SqlEntityManager,
} from '@mikro-orm/postgresql';
import {
  EntityManager,
  IDatabaseDriver,
  Connection,
} from '@mikro-orm/core';
import { Session } from 'express-session';

export type ApolloContextType = {
  em: SqlEntityManager<PostgreSqlDriver> &
    EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Session };
  res: Response;
};
