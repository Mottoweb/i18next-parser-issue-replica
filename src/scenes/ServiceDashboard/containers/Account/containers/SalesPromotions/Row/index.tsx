import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icons, Table } from '@adnz/ui';
import { DATE_FORMAT } from 'src/constants';
import confirmAlert from 'src/components/confirmAlert';
import { useRequest } from '@adnz/use-request';
import notify from 'src/modules/Notification';
import { useRequestErrorNotification } from 'src/hooks/useRequestErrorNotification';
import {
  SalesPromotionDto,
  fromDateTime,
  removeSalesPromotionAccounts,
} from '@adnz/api-ws-funnel';

interface PromotionRowParams {
  salesPromotion: SalesPromotionDto,
  index: number,
  accountId: string,
  resetItems: () => void,
}

const PromotionRow: React.FC<PromotionRowParams> = ({
  salesPromotion,
  index,
  resetItems,
  accountId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const navigateToDetails = React.useCallback(
    () => history.push(`/workflows/salesFunnel/promotions/details/${salesPromotion.id}`),
    [history, salesPromotion],
  );

  const [,, removeAccounts] = useRequest({
    apiMethod: removeSalesPromotionAccounts,
    runOnMount: false,
    onFail: useRequestErrorNotification(),
    onSuccess: React.useCallback(
      () => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_ACCOUNT_REMOVED'));
        resetItems();
      },
      [resetItems, t],
    ),
  });

  const confirm = () => confirmAlert({
    title: t('serviceDashboard:CONFIRM_REMOVE'),
    message: t('serviceDashboard:ARE_YOU_SURE_TO_REMOVE_ACCOUNT'),
    buttons: [
      {
        label: t('serviceDashboard:YES_LABEL'),
        onClick: (close) => {
          removeAccounts([accountId], { salesPromotionId: salesPromotion.id });
          close();
        },
      },
    ],
    closeText: t('serviceDashboard:NO_LABEL'),
  });

  return (
    <Table.Tr onClick={navigateToDetails} key={salesPromotion.id} rowIndex={index}>
      <Table.Td>{salesPromotion.name}</Table.Td>
      <Table.Td>
        {salesPromotion.phase ? t(salesPromotion.phase) : ''}
      </Table.Td>
      <Table.Td>
        {fromDateTime(salesPromotion.startDate)?.format(DATE_FORMAT)}
      </Table.Td>
      <Table.Td>
        {fromDateTime(salesPromotion.endDate)?.format(DATE_FORMAT)}
      </Table.Td>
      <Table.Td>
        {fromDateTime(salesPromotion.deadline)?.format(DATE_FORMAT)}
      </Table.Td>
      <Table.Td
        css="width: 1px;"
        type="action"
        onClick={(e) => e.stopPropagation()}
      >
        <Table.ActionsList rowIndex={index}>
          <Table.ActionsListItem
            onClick={confirm}
            icon={(<Icons.Trash />)}
            remove
          >
            {t('serviceDashboard:DELETE')}
          </Table.ActionsListItem>
        </Table.ActionsList>
      </Table.Td>
    </Table.Tr>
  );
};

export default PromotionRow;
