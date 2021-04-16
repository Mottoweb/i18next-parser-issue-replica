import { ValidateField } from 'src/types';

export interface TypeConfigFormValues {
  id?: string;
  name: string;
  active: boolean;
  statuses: string[];
}

export default (values: TypeConfigFormValues): ReturnType<ValidateField<TypeConfigFormValues>> => {
  const errors: ReturnType<ValidateField<TypeConfigFormValues>> = {};

  if (!values.name) {
    errors.name = 'NAME_REQUIRED';
  }
  return errors;
};
