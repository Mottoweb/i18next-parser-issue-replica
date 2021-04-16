import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Label, Checkbox, Table, Icons, Tag,
} from '@adnz/ui';
import Colors from 'src/theme/Colors';
import AmountCell from 'src/components/AmountCell';
import confirmAlert from 'src/components/confirmAlert';
import { useRequest } from '@adnz/use-request';
import { removeSalesPromotionAccounts, SalesPromotionAccount } from '@adnz/api-ws-funnel';
import notify from 'src/modules/Notification';
import { useDispatch, useSelector } from '../../../context';
import * as selectors from '../../../selectors';
import * as actions from '../../../actions';
import AssigneeSelector from '../AssigneeSelector';

const AccountItem: React.FC<{ account: SalesPromotionAccount, salesPromotionId: string, index: number }> = ({
  account, salesPromotionId, index,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const { task } = account;
  const selectedAccountIds = useSelector(selectors.getSelectedAccountIds, []);
  const isCheckboxChecked = React.useMemo(
    () => selectedAccountIds.includes(account.accountId),
    [selectedAccountIds, account],
  );

  const [,, removeAccounts] = useRequest({
    apiMethod: removeSalesPromotionAccounts,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (newItem) => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_ACCOUNT_REMOVED'));
        dispatch(actions.UPDATE_PROMOTION(newItem));
      },
      [dispatch, t],
    ),
  });

  const confirm = () => confirmAlert({
    title: t('serviceDashboard:CONFIRM_REMOVE'),
    message: t('serviceDashboard:ARE_YOU_SURE_TO_REMOVE_ACCOUNT'),
    buttons: [
      {
        label: t('serviceDashboard:YES_LABEL'),
        onClick: (close) => {
          removeAccounts([account.accountId], { salesPromotionId });
          close();
        },
      },
    ],
    closeText: t('serviceDashboard:NO_LABEL'),
  });

  const selectAccount = React.useCallback(
    () => dispatch(actions.SELECT_ACCOUNT({ id: account.accountId, isRemove: isCheckboxChecked })),
    [dispatch, account.accountId, isCheckboxChecked],
  );

  return (
    <Table.Tr key={account.accountId}>
      <Table.Td css="width: 1px;">
        <Label>
          <Checkbox checked={isCheckboxChecked} onChange={selectAccount} square />
        </Label>
      </Table.Td>
      <Table.Td>
        <Link to={`/buy-side/accounts/${account.accountId}`}>
          #
          {account.accountId}
        </Link>
        <p className="cell-with-impressions__title">{account.accountName}</p>
      </Table.Td>
      <Table.Td className="text-left">
        {task?.leadSource?.name}
      </Table.Td>
      <Table.Td className="text-left">
        {t(task?.priority ?? '')}
      </Table.Td>
      <Table.Td>
        {!task || task?.assignee?.name
          ? (<span>{task?.assignee?.name}</span>) : (
            <Table.Field>
              <AssigneeSelector task={task} salesPromotionId={salesPromotionId} accountId={account.accountId} />
            </Table.Field>
          )}
      </Table.Td>
      <Table.Td>
        {task && task.tags.map((tag) => (
          <Tag
            key={tag.id}
            value={tag.name}
            color={Colors['adnz-green']}
          />
        ))}
      </Table.Td>
      <AmountCell value={task?.campaign?.amountNet4} />
      <Table.Td css="width: 1px;" type="action">
        <Table.ActionsList rowIndex={index}>
          <Table.ActionsListItem
            onClick={confirm}
            icon={(<Icons.Trash />)}
          >
            {t('serviceDashboard:DELETE')}
          </Table.ActionsListItem>
        </Table.ActionsList>
      </Table.Td>
    </Table.Tr>
  );
};

export default AccountItem;
