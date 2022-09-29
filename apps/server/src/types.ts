import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createUserLoader } from './utils/createUserLoader';

export type ApolloContextType = {
  redis: Redis;
  req: Request;
  res: Response;
  payload?: { userId: string };
  userLoader: ReturnType<typeof createUserLoader>;
};
