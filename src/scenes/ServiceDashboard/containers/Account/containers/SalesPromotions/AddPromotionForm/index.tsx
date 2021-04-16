import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import { Form } from 'react-final-form';
import { useRequestErrorNotification } from 'src/hooks/useRequestErrorNotification';
import notify from 'src/modules/Notification';
import {
  addSalesPromotionAccounts,
} from '@adnz/api-ws-funnel';
import { ValidateField } from 'src/types';
import AddPromotionForm, { FormValues } from './form';

const validate = (values: FormValues) => {
  const errors: ReturnType<ValidateField<FormValues>> = {};

  if (!values.salesPromotionId) {
    errors.salesPromotionId = 'SALES_PROMOTION_IS_REQUIRED';
  }

  return errors;
};

interface PromotionFormParams {
  accountId: string;
  opened: boolean;
  resetItems: () => void;
  setOpened: (isOpened: boolean) => void;
}

const PromotionForm:React.FC<PromotionFormParams> = ({
  accountId, opened, resetItems, setOpened,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  const initialValues = { includeContacts: false };

  const [,, addAccount] = useRequest({
    apiMethod: addSalesPromotionAccounts,
    runOnMount: false,
    onFail: useRequestErrorNotification(),
    onSuccess: React.useCallback(
      () => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_ACCOUNT_ADDED'));
        setOpened(false);
        resetItems();
      },
      [setOpened, t, resetItems],
    ),
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      addAccount([{ accountId, includeContacts: !!values.includeContacts }],
        { salesPromotionId: values.salesPromotionId.value });
    },
    [accountId, addAccount],
  );

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues}
      render={({
        handleSubmit,
        submitting,
      }) => (
        <AddPromotionForm
          handleSubmit={handleSubmit}
          opened={opened}
          setOpened={setOpened}
          submitting={submitting}
        />
      )}
    />
  );
};

export default PromotionForm;
