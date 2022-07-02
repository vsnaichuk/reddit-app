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
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          // TODO: fix types
          login: (result, args, cache, info) => {
            // @ts-ignore
            return cache.updateQuery({ query: MeDocument }, () => {
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
