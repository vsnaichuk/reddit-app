import { FieldError } from '../generated/graphql';

export const toErrorMap = (errors: FieldError[]) => {
  const errorsMap: Record<string, string> = {};

  errors.forEach((error: FieldError) => {
    errorsMap[error.field] = error.message;
  });

  return errorsMap;
};
