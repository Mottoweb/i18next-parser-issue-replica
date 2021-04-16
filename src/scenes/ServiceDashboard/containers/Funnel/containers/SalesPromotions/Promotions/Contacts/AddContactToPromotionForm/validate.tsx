import { ValidateField } from 'src/types';
import { FormValues } from './form';

export default (values: FormValues): ReturnType<ValidateField<FormValues>> => {
  const errors: ReturnType<ValidateField<FormValues>> = {};

  if (!values.salesPromotionId) {
    errors.salesPromotionId = 'PROMOTION_REQUIRED';
  }
  return errors;
};
