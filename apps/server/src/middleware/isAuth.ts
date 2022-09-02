import { MiddlewareFn } from 'type-graphql';
import { ApolloContextType } from '../types';

export const isAuth: MiddlewareFn<ApolloContextType> = (
  { context },
  next,
) => {
  if (!context.req.session.userId) {
    throw new Error('not authenticated');
  }

  return next();
};
