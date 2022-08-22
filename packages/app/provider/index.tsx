import { cacheExchange } from '@urql/exchange-graphcache';
import {
  GraphCacheConfig,
  MeDocument,
  WithTypename,
  User,
} from 'app/generated/graphql';
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider as UrqlProvider,
} from 'urql';
import { Dripsy } from './dripsy';
import { NavigationProvider } from './navigation';

const client = createClient({
  url: 'http://localhost:4001/graphql',
  fetchOptions: {
    credentials: 'include',
    headers: {
      'X-Forwarded-Proto': 'https',
    },
  },
  exchanges: [
    dedupExchange,
    cacheExchange<GraphCacheConfig>({
      updates: {
        Mutation: {
          login: (result, _, cache) => {
            cache.updateQuery({ query: MeDocument }, () => {
              if (result?.login.errors) {
                return MeDocument;
              } else {
                return {
                  me: result.login.user,
                };
              }
            });
          },
          logout: (result, _, cache) => {
            cache.updateQuery({ query: MeDocument }, () => ({
              me: null,
            }));
          },
        },
      },
    }),
    fetchExchange,
  ],
});

export function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UrqlProvider value={client}>
      <NavigationProvider>
        <Dripsy>{children}</Dripsy>
      </NavigationProvider>
    </UrqlProvider>
  );
}
