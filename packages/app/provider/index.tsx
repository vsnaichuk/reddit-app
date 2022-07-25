import { cacheExchange } from '@urql/exchange-graphcache';
import { MeDocument } from 'app/generated/graphql';
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
    cacheExchange({
      updates: {
        Mutation: {
          // TODO: fix types
          login: (result, _, cache) => {
            // @ts-ignore
            cache.updateQuery({ query: MeDocument }, () => {
              // @ts-ignore
              if (result?.register.errors) {
                return MeDocument;
              } else {
                return {
                  // @ts-ignore
                  me: result.register.user,
                };
              }
            });
          },
          logout: (result, _, cache) => {
            // @ts-ignore
            cache.updateQuery({ query: MeDocument }, () => {
              return {
                me: null,
              };
            });
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
