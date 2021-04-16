import { ValidateField } from 'src/types';
import { FormValues } from './form';

export default (values: FormValues): ReturnType<ValidateField<FormValues>> => {
  const errors: ReturnType<ValidateField<FormValues>> = {};

  if (!values.status) {
    errors.status = 'STATUS_MUST_BE_NOT_EMPTY';
  }
  return errors;
};
