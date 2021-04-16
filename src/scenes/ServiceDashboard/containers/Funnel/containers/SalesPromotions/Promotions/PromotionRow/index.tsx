import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icons, Table } from '@adnz/ui';
import confirmAlert from 'src/components/confirmAlert';
import { DATE_FORMAT } from 'src/constants';
import { useRequest } from '@adnz/use-request';
import { cloneSalesPromotion, SalesPromotionDto, fromDateTime } from '@adnz/api-ws-funnel';
import notify from 'src/modules/Notification';
import * as actions from '../../actions';
import { useDispatch } from '../../context';

interface PromotionRowItem {
  salesPromotion: SalesPromotionDto,
  index: number,
}

const PromotionRow: React.FC<PromotionRowItem> = ({
  salesPromotion,
  index,
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const navigateToDetails = React.useCallback(
    () => history.push(`/workflows/salesFunnel/promotions/details/${salesPromotion.id}`),
    [history, salesPromotion],
  );

  const [,, clone] = useRequest({
    apiMethod: cloneSalesPromotion,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (newItem) => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_CLONED'));
        dispatch(actions.SAVE_PROMOTION(newItem));
      },
      [dispatch, t],
    ),
  });

  const openEdit = () => dispatch(actions.OPEN_EDIT_PROMOTION(salesPromotion.id));

  const confirm = () => confirmAlert({
    title: t('serviceDashboard:CONFIRM_CLONE'),
    message: t('serviceDashboard:ARE_YOU_SURE_TO_CLONE_PROMOTION'),
    buttons: [
      {
        label: t('serviceDashboard:YES_LABEL'),
        onClick: (close) => {
          clone({ salesPromotionId: salesPromotion.id });
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
        {salesPromotion?.typeConfig.name}
      </Table.Td>
      <Table.Td dataTestId="status-cell">
        {t(salesPromotion.status)}
      </Table.Td>
      <Table.Td dataTestId="phase-cell">
        {salesPromotion.phase ? t(salesPromotion.phase) : ''}
      </Table.Td>
      <Table.Td>
        {fromDateTime(salesPromotion.startDate)?.format(DATE_FORMAT)}
      </Table.Td>
      <Table.Td>
        {fromDateTime(salesPromotion.endDate)?.format(DATE_FORMAT)}
      </Table.Td>
      <Table.Td
        css="width: 1px;"
        type="action"
        onClick={(e) => e.stopPropagation()}
      >
        <Table.ActionsList rowIndex={index}>
          <Table.ActionsListItem
            onClick={confirm}
            icon={(<Icons.Copy />)}
            dataTestId="copy-promotion-button"
          >
            {t('serviceDashboard:COPY')}
          </Table.ActionsListItem>
          <Table.ActionsListItem
            onClick={openEdit}
            icon={(<Icons.Edit />)}
            dataTestId="edit-promotion-button"
          >
            {t('serviceDashboard:EDIT')}
          </Table.ActionsListItem>
        </Table.ActionsList>
      </Table.Td>
    </Table.Tr>
  );
};

export default PromotionRow;
