import { ValidateField } from 'src/types';
import { FormValues } from './form';

export default (values: FormValues): ReturnType<ValidateField<FormValues>> => {
  const errors: ReturnType<ValidateField<FormValues>> = {};

  if (!values.name) {
    errors.name = 'NAME_REQUIRED';
  }
  if (!values.typeConfigId) {
    errors.typeConfigId = 'TYPE_CONFIG_IS_REQUIRED';
  }
  if (values.revenueGoal && values.revenueGoal >= 100000000000000) {
    errors.revenueGoal = 'SHOULD_BE_LESS_THAN_E14';
  }
  return errors;
};
