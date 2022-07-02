import { NavigationContainer } from '@react-navigation/native';
import { useMemo } from 'react';
import * as Linking from 'expo-linking';

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationContainer
      linking={useMemo(
        () => ({
          prefixes: [Linking.createURL('/')],
          config: {
            initialRouteName: 'login',
            screens: {
              login: '/login',
              register: '/register',
              home: '',
              // home: '',
              // 'user-detail': 'user/:id',
            },
          },
        }),
        [],
      )}
    >
      {children}
    </NavigationContainer>
  );
}
