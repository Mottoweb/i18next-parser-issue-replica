import {
  SalesPromotionAccountForm,
} from '@adnz/api-ws-funnel';
import { getValue } from 'src/components/ReactSelectV2Field';

export interface FormValues {
  accounts: Array<{ accountId: { label:string, value?:string }; includeContacts: boolean }>;
}

export const prepareValues = (formValues: FormValues) : SalesPromotionAccountForm[] => formValues.accounts
  .map((a) => ({
    accountId: getValue(a.accountId),
    includeContacts: a.includeContacts,
  }));
