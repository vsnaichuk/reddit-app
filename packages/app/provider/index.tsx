import { Dripsy } from './dripsy';
import { NavigationProvider } from './navigation';
import { createClient, Provider as UrqlProvider } from 'urql';

const client = createClient({
  url: 'http://localhost:4001/graphql',
  fetchOptions: {
    credentials: 'include',
  },
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
