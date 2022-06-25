import { styled } from 'dripsy';
import React from 'react';
import { View, Button } from 'react-native';
import { FormikValues, Formik } from 'formik';
import { useMutation } from 'urql';

import { Field, Separator } from 'app/components';

export const Container = styled(View)({
  flex: 1,
  alignItems: 'center',
  width: '100%',
  bg: '#000',
  px: '10%',
});

const FormContainer = styled(View)({
  width: '100%',
  maxWidth: 800,
  p: 3,
  bg: '#15172b',
  borderRadius: 20,
});

const REGISTER_MUT = `
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
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

export function RegisterScreen() {
  const [, register] = useMutation(REGISTER_MUT);

  // TODO: Add better typing for values
  function onSubmit(values: FormikValues) {
    console.log('submit');
    register(values);
  }

  const initialValues: FormikValues = {
    username: '',
    pass: '',
  };

  return (
    <Container>
      <FormContainer>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <View>
              <Field
                name="username"
                label="Username"
                placeholder="Type your username"
              />

              <Separator size={2} />

              <Field
                name="password"
                label="Password"
                placeholder="Type your password"
              />

              <Separator size={4} />

              <Button
                onPress={handleSubmit as (values: any) => void}
                title="Sign up"
              />
            </View>
          )}
        </Formik>
      </FormContainer>
    </Container>
  );
}
