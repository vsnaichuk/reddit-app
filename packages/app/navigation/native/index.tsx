import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../../features/user/login-screen';
import { RegisterScreen } from '../../features/user/register-screen';
import { SettingsScreen } from '../../features/user/settings-screen';
// import { HomeScreen } from '../../features/home/screen';
// import { UserDetailScreen } from '../../features/user/detail-screen';

const Stack = createNativeStackNavigator<{
  login: undefined;
  register: undefined;
  settings: undefined;
  // home: undefined
  // 'user-detail': {
  //   id: string
  // },
}>();

export function NativeNavigation() {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        component={RegisterScreen}
        options={{
          title: 'Register',
        }}
      />
      <Stack.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
      {/* <Stack.Screen
        name="user-detail"
        component={UserDetailScreen}
        options={{
          title: 'User',
        }}
      /> */}
    </Stack.Navigator>
  );
}
