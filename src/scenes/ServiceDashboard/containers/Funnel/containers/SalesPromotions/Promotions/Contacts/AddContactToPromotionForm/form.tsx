import { SalesPromotionContact } from '@adnz/api-ws-funnel';

export interface FormValues {
  salesPromotionId?: { label:string, value:string };
  contactIds: Array<string>;
}

export const prepareValues = (formValues: FormValues) : SalesPromotionContact[] => formValues.contactIds
  .map((contactId) => ({ contactId }));
