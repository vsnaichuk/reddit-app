import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RegisterScreen } from '../../features/user/register-screen';
// import { HomeScreen } from '../../features/home/screen';
// import { UserDetailScreen } from '../../features/user/detail-screen';
// import { SettingsScreen } from '../../features/user/settings-screen';

const Stack = createNativeStackNavigator<{
  register: undefined;
  // home: undefined
  // 'user-detail': {
  //   id: string
  // },
  // settings: undefined
}>();

export function NativeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="register"
        component={RegisterScreen}
        options={{
          title: 'Register',
        }}
      />
      {/* <Stack.Screen
        name="user-detail"
        component={UserDetailScreen}
        options={{
          title: 'User',
        }}
      />
      <Stack.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      /> */}
    </Stack.Navigator>
  );
}
