import { ValidateField } from 'src/types';
import { FormValues } from './form';

export default (values: FormValues): ReturnType<ValidateField<FormValues>> => {
  const errors: ReturnType<ValidateField<FormValues>> = {};

  if (!values.priority) {
    errors.priority = 'PRIORITY_REQUIRED';
  }
  if (!values.leadSource) {
    errors.leadSource = 'SOURCE_REQUIRED';
  }
  return errors;
};
