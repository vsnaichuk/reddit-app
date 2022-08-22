import { Resolver as GraphCacheResolver, UpdateResolver as GraphCacheUpdateResolver, OptimisticMutationResolver as GraphCacheOptimisticMutationResolver, StorageAdapter as GraphCacheStorageAdapter } from '@urql/exchange-graphcache';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updatePost?: Maybe<Post>;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  title: Scalars['String'];
  updateAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: Array<Post>;
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  updateAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, createdAt: string, updateAt: string, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, createdAt: string, updateAt: string, username: string } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string } | null };


export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    errors {
      field
      message
    }
    user {
      id
      createdAt
      updateAt
      username
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      id
      createdAt
      updateAt
      username
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    username
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export type WithTypename<T extends { __typename?: any }> = Partial<T> & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  FieldError?: (data: WithTypename<FieldError>) => null | string,
  Post?: (data: WithTypename<Post>) => null | string,
  User?: (data: WithTypename<User>) => null | string,
  UserResponse?: (data: WithTypename<UserResponse>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    hello?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Scalars['String'] | string>,
    me?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<User> | string>,
    post?: GraphCacheResolver<WithTypename<Query>, QueryPostArgs, WithTypename<Post> | string>,
    posts?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<Post> | string>>
  },
  FieldError?: {
    field?: GraphCacheResolver<WithTypename<FieldError>, Record<string, never>, Scalars['String'] | string>,
    message?: GraphCacheResolver<WithTypename<FieldError>, Record<string, never>, Scalars['String'] | string>
  },
  Post?: {
    createdAt?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['Int'] | string>,
    title?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['String'] | string>,
    updateAt?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['String'] | string>
  },
  User?: {
    createdAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    updateAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    username?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>
  },
  UserResponse?: {
    errors?: GraphCacheResolver<WithTypename<UserResponse>, Record<string, never>, Array<WithTypename<FieldError> | string>>,
    user?: GraphCacheResolver<WithTypename<UserResponse>, Record<string, never>, WithTypename<User> | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  createPost?: GraphCacheOptimisticMutationResolver<MutationCreatePostArgs, WithTypename<Post>>,
  forgotPassword?: GraphCacheOptimisticMutationResolver<MutationForgotPasswordArgs, Scalars['Boolean']>,
  login?: GraphCacheOptimisticMutationResolver<MutationLoginArgs, WithTypename<UserResponse>>,
  logout?: GraphCacheOptimisticMutationResolver<Record<string, never>, Scalars['Boolean']>,
  register?: GraphCacheOptimisticMutationResolver<MutationRegisterArgs, WithTypename<UserResponse>>,
  updatePost?: GraphCacheOptimisticMutationResolver<MutationUpdatePostArgs, Maybe<WithTypename<Post>>>
};

export type GraphCacheUpdaters = {
  Mutation?: {
    createPost?: GraphCacheUpdateResolver<{ createPost: WithTypename<Post> }, MutationCreatePostArgs>,
    forgotPassword?: GraphCacheUpdateResolver<{ forgotPassword: Scalars['Boolean'] }, MutationForgotPasswordArgs>,
    login?: GraphCacheUpdateResolver<{ login: WithTypename<UserResponse> }, MutationLoginArgs>,
    logout?: GraphCacheUpdateResolver<{ logout: Scalars['Boolean'] }, Record<string, never>>,
    register?: GraphCacheUpdateResolver<{ register: WithTypename<UserResponse> }, MutationRegisterArgs>,
    updatePost?: GraphCacheUpdateResolver<{ updatePost: Maybe<WithTypename<Post>> }, MutationUpdatePostArgs>
  },
  Subscription?: {},
};

export type GraphCacheConfig = {
  schema?: IntrospectionData,
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
  storage?: GraphCacheStorageAdapter
};