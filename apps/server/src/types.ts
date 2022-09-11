import { Request, Response } from 'express';
import { Session } from 'express-session';
import { Redis } from 'ioredis';
import { createUserLoader } from './utils/createUserLoader';

type RequestType = Request & {
  session: Session & { userId: string };
};

export type ApolloContextType = {
  redis: Redis;
  req: RequestType;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
};
