import { ValidateField } from 'src/types';
import { FormValues } from './form';

export default (values: FormValues): ReturnType<ValidateField<FormValues>> => {
  const errors: ReturnType<ValidateField<FormValues>> = {};

  if (!values.name) {
    errors.name = 'NAME_REQUIRED';
  }
  if (!values.typeConfigId) {
    errors.name = 'TYPE_CONFIG_IS_REQUIRED';
  }
  return errors;
};
