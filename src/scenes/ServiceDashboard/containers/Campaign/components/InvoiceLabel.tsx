import React from 'react';
import { useTranslation } from 'react-i18next';
import Colors from 'src/theme/Colors';
import { Tag } from '@adnz/ui';
import * as constants from 'src/constants';

export interface IInvoiceLabel {
  invoiceLabel: string
}

const InvoiceLabel: React.FC<IInvoiceLabel> = ({
  invoiceLabel,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_CHARGED) {
    return <Tag value={t('serviceDashboard:INVOICE_CHARGED')} color={Colors['adnz-green']} />;
  }

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_PAID) {
    return <Tag value={t('serviceDashboard:INVOICE_PAID')} color={Colors['adnz-green']} />;
  }

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_FIRST_REMINDER) {
    return <Tag value={t('serviceDashboard:INVOICE_FIRST_REMINDER')} color={Colors['adnz-danger']} />;
  }

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_SECOND_REMINDER) {
    return <Tag value={t('serviceDashboard:INVOICE_SECOND_REMINDER')} color={Colors['adnz-danger']} />;
  }

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_THIRD_REMINDER) {
    return <Tag value={t('serviceDashboard:INVOICE_THIRD_REMINDER')} color={Colors['adnz-danger']} />;
  }

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_PERSONAL_CALL_REMINDER) {
    return <Tag value={t('serviceDashboard:INVOICE_THIRD_REMINDER')} color={Colors['adnz-danger']} />;
  }

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_PERSONAL_CALL_REQUESTED_REMINDER) {
    return <Tag value={t('serviceDashboard:INVOICE_PERSONAL_CALL_REQUESTED_REMINDER')} color={Colors['adnz-danger']} />;
  }

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_COLLECTION_REMINDER) {
    return <Tag value={t('serviceDashboard:INVOICE_COLLECTION_REMINDER')} color={Colors['adnz-danger']} />;
  }

  if (invoiceLabel === constants.CAMPAIGN_INVOICE_LABEL_BAD_DEBT) {
    return <Tag value={t('serviceDashboard:INVOICE_BAD_DEBT')} color={Colors['adnz-danger']} />;
  }

  return null;
};

export default InvoiceLabel;
