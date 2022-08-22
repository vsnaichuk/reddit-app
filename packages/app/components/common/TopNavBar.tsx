import { useLogoutMutation, useMeQuery } from 'app/generated/graphql';
import { styled } from 'dripsy';
import { View, ViewProps, Text as BaseText } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { TextLink } from 'solito/link';
import { Separator } from './Separator';

const Container = styled(View)((props: ITopNavBarProps) => ({
  flexDirection: 'row',
  backgroundColor: 'tomato',
  justifyContent: 'flex-end',
  p: 3,
}));

const VerticalSeparator = styled(View)({
  pl: 2,
});

const Text = styled(BaseText)({
  color: 'white',
});

const Button = styled(RectButton)({
  color: 'white',
});

interface ITopNavBarProps extends ViewProps {}

export function TopNavBar(props: ITopNavBarProps) {
  const [, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();

  function onLogout() {
    logout();
  }

  if (fetching) {
    return <Text>...</Text>;
  }

  if (!data?.me) {
    return (
      <Container {...props}>
        <TextLink href="/login">
          <Text>Login</Text>
        </TextLink>
        <VerticalSeparator />
        <TextLink href="/register">
          <Text>Register</Text>
        </TextLink>
      </Container>
    );
  }

  return (
    <Container {...props}>
      <Text>{data.me.username}</Text>
      <VerticalSeparator />
      <Button onPress={onLogout}>Logout</Button>
    </Container>
  );
}
