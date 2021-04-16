import { getValue } from 'src/components/ReactSelectV2Field';

export interface FormValues {
  contacts: Array<{ contactId: { label:string, value?:string } }>;
}

export const prepareContactValues = (formValues: FormValues) : { contactId: string }[] => formValues.contacts
  .map((c) => ({
    contactId: getValue(c.contactId),
  }));
