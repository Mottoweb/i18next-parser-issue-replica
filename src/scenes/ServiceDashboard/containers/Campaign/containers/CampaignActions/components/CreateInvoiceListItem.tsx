import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRequest } from '@adnz/use-request';
import { DropdownList } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import notify from 'src/modules/Notification';
import { createManualInvoice } from '@adnz/api-ws-invoices';

export interface ICreateInvoiceListItem {
  campaignId: string
}

const CreateInvoiceListItem: React.FC<ICreateInvoiceListItem> = ({
  campaignId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();

  const [, { pending }, createInvoice] = useRequest({
    onFail: React.useCallback(
      ({ response }) => notify.danger('', t(response?.data.message)),
      [t],
    ),
    onSuccess: React.useCallback(
      () => history.push(`/workflows/admin/invoices/campaigns/${campaignId}`),
      [campaignId, history],
    ),
    apiMethod: createManualInvoice,
    runOnMount: false,
  });

  const handleClick = React.useCallback(
    async () => createInvoice({ entityId: campaignId }),
    [campaignId, createInvoice],
  );

  return (
    <DropdownList.Item
      id="create-invoice-dropdown-item"
      onClick={handleClick}
      isLoading={pending}
    >
      {t('serviceDashboard:CREATE_INVOICE')}
    </DropdownList.Item>
  );
};

export default CreateInvoiceListItem;
