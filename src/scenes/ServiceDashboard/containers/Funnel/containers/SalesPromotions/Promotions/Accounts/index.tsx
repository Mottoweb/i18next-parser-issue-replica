import React from 'react';
import {
  Button, ButtonGroup, DropdownList, Table, Section,
} from '@adnz/ui';
import SectionTitle from 'src/components/SectionTitle';
import { useTranslation } from 'react-i18next';
import ToggleAll from 'src/scenes/Workflow/containers/Operations/containers/Booked/containers/CampaignItem/ToggleAll';
import { useRequest } from '@adnz/use-request';
import { removeSalesPromotionAccounts } from '@adnz/api-ws-funnel';
import notify from 'src/modules/Notification';
import { useDispatch, useSelector } from '../../context';
import AccountItem from './AccountItem';
import * as selectors from '../../selectors';
import AddAccountsForm from './AddAccountsForm';
import GenerateLeadsForm from './GenerateLeadsForm';
import * as actions from '../../actions';

const Accounts: React.FC<{ salesPromotionId: string }> = ({ salesPromotionId }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const accounts = useSelector(selectors.getAccounts, []);
  const isAllAccountsShown = useSelector(selectors.isAllAccountsShown, []);
  const selectedAccountIds = useSelector(selectors.getSelectedAccountIds, []);
  const isCheckboxChecked = React.useMemo(
    () => selectedAccountIds.length === accounts.length,
    [selectedAccountIds.length, accounts.length],
  );

  const DEFAULT_SHOWN_AMOUNT = 15;
  const accountsToShow = isAllAccountsShown ? accounts : accounts.slice(0, DEFAULT_SHOWN_AMOUNT);

  const selectAll = () => dispatch(actions.SELECT_ACCOUNTS({
    ids: accounts.map((a) => a.accountId),
    isRemove: isCheckboxChecked,
  }));

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

  const openAddAccountsModal = () => dispatch(actions.OPEN_ADD_ACCOUNTS());
  const openGenerateLeadsModal = () => dispatch(actions.OPEN_GENERATE_LEADS());
  const toggleShowAll = () => dispatch(actions.TOGGLE_SHOW_ALL_ACCOUNTS());

  return (
    <div>
      <div className="table-responsive overflow-y-auto">
        <AddAccountsForm salesPromotionId={salesPromotionId} />
        <GenerateLeadsForm salesPromotionId={salesPromotionId} />
        <SectionTitle>
          <span>{t('serviceDashboard:ACCOUNTS')}</span>
          <Button onClick={openAddAccountsModal} id="create-button">{t('serviceDashboard:ADD_ACCOUNTS')}</Button>
        </SectionTitle>
        <Section>
          <Table>
            <thead>
              <Table.Tr>
                <Table.Th css="width: 1px;">
                  <ToggleAll checked={isCheckboxChecked} handleChange={selectAll} />
                </Table.Th>
                <Table.Th>{t('serviceDashboard:ACCOUNT')}</Table.Th>
                <Table.Th>{t('serviceDashboard:LEAD_STATUS')}</Table.Th>
                <Table.Th>{t('serviceDashboard:PRIORITY')}</Table.Th>
                <Table.Th>{t('serviceDashboard:ASSIGNEE')}</Table.Th>
                <Table.Th>{t('serviceDashboard:LABELS')}</Table.Th>
                <Table.Th>{t('serviceDashboard:OFFER_N4')}</Table.Th>
                <Table.Th data-testid="dropdown-container-button">
                  <DropdownList
                    id="promotion_accounts_menu"
                    css="margin-bottom: 5px;"
                    theme="create"
                    inThead
                  >
                    <DropdownList.Item
                      data-testid="generate-leads-list-item"
                      onClick={openGenerateLeadsModal}
                      disabled={selectedAccountIds.length === 0}
                      children={t('serviceDashboard:GENERATE_LEADS')}
                    />
                    <DropdownList.Item
                      data-testid="remove-acocunts-list-item"
                      onClick={() => removeAccounts(selectedAccountIds, { salesPromotionId })}
                      disabled={selectedAccountIds.length === 0}
                      children={t('serviceDashboard:DELETE')}
                    />
                  </DropdownList>
                </Table.Th>
              </Table.Tr>
            </thead>
            <tbody className="dash-tbody">
              {accountsToShow.map((account, index) => (
                <AccountItem
                  key={account.accountId}
                  account={account}
                  salesPromotionId={salesPromotionId}
                  index={index}
                />
              ))}
            </tbody>
          </Table>
        </Section>
      </div>
      <div className="spacer" />
      {accounts.length > DEFAULT_SHOWN_AMOUNT && (
      <ButtonGroup align="right">
        <Button
          data-testid="show-more-account-table"
          onClick={toggleShowAll}
          theme="create-secondary"
        >
          {isAllAccountsShown ? t('serviceDashboard:SHOW_LESS') : t('serviceDashboard:SHOW_MORE')}
        </Button>
      </ButtonGroup>
      )}
    </div>
  );
};

export default Accounts;
