import {
  PostgreSqlDriver,
  SqlEntityManager,
} from '@mikro-orm/postgresql';
import {
  EntityManager,
  IDatabaseDriver,
  Connection,
} from '@mikro-orm/core';

export type ApolloContextType = {
  em: SqlEntityManager<PostgreSqlDriver> &
    EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};
