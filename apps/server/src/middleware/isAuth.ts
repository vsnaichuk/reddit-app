import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { ApolloContextType } from '../types';

export const isAuth: MiddlewareFn<ApolloContextType> = (
  { context },
  next,
) => {
  const token = context.req.headers.authorization?.split(' ')[1]; //Authorization: 'Bearer TOKEN'

  if (!token) {
    throw new Error('not authenticated');
  }

  try {
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    throw new Error('not authenticated');
  }

  return next();
};
