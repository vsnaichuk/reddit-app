import { styled } from 'dripsy';
import React from 'react';
import { View, Button } from 'react-native';
import { Formik, FormikHelpers } from 'formik';

import { Field, Separator } from 'app/components';
import {
  useRegisterMutation,
  UsernamePasswordInput,
} from 'app/generated/graphql';
import { toErrorMap } from 'app/utils/toErrorMap';
import { useRouter } from 'solito/router';

const Container = styled(View)({
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

export function RegisterScreen() {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  async function onSubmit(
    values: UsernamePasswordInput,
    formikHelpers: FormikHelpers<UsernamePasswordInput>,
  ) {
    const res = await register({ options: values });
    const errors = res.data?.register.errors;

    if (errors) {
      return formikHelpers.setErrors(toErrorMap(errors));
    }

    router.push('/');
  }

  const initialValues: UsernamePasswordInput = {
    username: '',
    password: '',
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
