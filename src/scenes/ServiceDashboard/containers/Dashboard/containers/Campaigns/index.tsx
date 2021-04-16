import React from 'react';
import { useRequest } from '@adnz/use-request';
import { Container } from 'styled-bootstrap-grid';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as companySelectSelector from 'src/scenes/ServiceDashboard/containers/CompanySelect/selectors';
import Table from 'src/components/TableV2Field/components/Table';
import { Th, ThSortable } from 'src/components/TableV2Field/components/Th';
import { PaginatedCampaignsShort, CampaignFilterObject, getAgencyCampaigns } from '@adnz/api-ws-salesforce';
import { useCampaignSortParameters } from 'src/scenes/Campaigns/hooks/useCampaignSortParameters';
import { useIdentityRoles } from '@adnz/use-auth';
import Campaign from '../Campaign';

export interface ICampaignsTableContainer {
  type: string
  accountId: string
}

const CampaignsTableContainer: React.FC<ICampaignsTableContainer> = ({
  type,
  accountId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const {
    sort, setSort, order, toggleOrder,
  } = useCampaignSortParameters(type);

  const selectedCompanyUuid = useSelector((state) => (accountId ? '' : companySelectSelector.getActiveId(state)));
  const { ADMIN: isAmountNet2Sortable } = useIdentityRoles();

  const parameters = React.useMemo<CampaignFilterObject>(() => ({
    type,
    page: 0,
    limit: 3,
    sort,
    order,
    accountIdFilter: accountId,
    selectedCompanyUuid: selectedCompanyUuid === null ? undefined : selectedCompanyUuid,
  }), [
    type,
    sort,
    order,
    accountId,
    selectedCompanyUuid,
  ]);

  const [data] = useRequest({
    apiMethod: getAgencyCampaigns,
    parameters: [parameters],
    defaultData: { items: [], total: 0 } as PaginatedCampaignsShort,
  });

  const amountHasData = React.useMemo<boolean>(
    () => !!data.items.find((item) => item.showAmount !== false),
    [data],
  );

  const changeOrder = React.useCallback((key: string) => {
    setSort(key);
    toggleOrder();
  }, [setSort, toggleOrder]);

  return (
    <Container className="table-container">
      <div className="table-container-mobile">
        <Table className="table">
          <thead>
            <tr>
              <Th><br /></Th>
              <Th>{t('serviceDashboard:CAMPAIGN')}</Th>
              <Th>{t('serviceDashboard:ADVERTISERS')}</Th>
              <Th>{t('serviceDashboard:SALES_CONTACT')}</Th>
              <Th>{t('serviceDashboard:START_DATE')}</Th>
              <Th>{t('serviceDashboard:END_DATE')}</Th>
              {isAmountNet2Sortable && (
                <ThSortable
                  order={order}
                  handleChangeOrder={() => changeOrder('amountNet2')}
                >
                  {t('serviceDashboard:AMOUNT_NET2')}
                </ThSortable>
              )}
              {!isAmountNet2Sortable && (
                <Th>{t('serviceDashboard:AMOUNT_NET2')}</Th>
              )}
            </tr>
          </thead>
          {data.items.map((item) => (
            <Campaign
              key={item.campaignId}
              type={type}
              campaign={item}
              amountHasData={amountHasData}
            />
          ))}
        </Table>
      </div>
    </Container>
  );
};

export default CampaignsTableContainer;
