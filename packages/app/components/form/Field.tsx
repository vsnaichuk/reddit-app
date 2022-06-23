import { styled } from 'dripsy';
import { useField } from 'formik';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

const LabelContainer = styled(View)({
  p: 2,
});

const Input = styled(TextInput)({
  width: '100%',
  p: 3,
  bg: '#303245',
  borderRadius: 12,
  color: '#EEEEEE',
  fontSize: 18,
});

const LabelText = styled(Text)({
  fontSize: 15,
  fontWeight: 'bold',
  color: '#EEEEEE',
  textAlign: 'left',
});

const ErrorText = styled(Text)({
  pt: 2,
  fontSize: 12,
  color: '#FF0000',
  textAlign: 'left',
});

interface IInputProps extends TextInputProps {
  name: string;
  label: string;
  placeholder: string;
}

export function Field({
  name,
  label,
  placeholder,
  onChangeText,
  ...props
}: IInputProps) {
  const [field, meta, helper] = useField(name);

  function handleChangeText(value: string) {
    helper.setTouched(true);
    helper.setValue(value);
  }

  return (
    <View>
      <LabelContainer>
        <LabelText>{label}</LabelText>
      </LabelContainer>

      <Input
        {...props}
        value={field.value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#EEEEEE"
      />
      {meta.error && meta.touched && (
        <ErrorText>{meta.error}</ErrorText>
      )}
    </View>
  );
}
