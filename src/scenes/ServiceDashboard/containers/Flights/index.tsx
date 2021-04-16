import React from 'react';
import { Map } from 'immutable';
import {
  Container,
} from 'styled-bootstrap-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import * as actions from 'src/scenes/ServiceDashboard/actions';
import {
  getAppliedValue as getSelectedQuery,
} from 'src/scenes/ServiceDashboard/containers/SearchFilter/selectors';
import { useIdentityRoles, Roles, PrivateRoute } from '@adnz/use-auth';
import SearchFilter from 'src/scenes/ServiceDashboard/containers/SearchFilter';
import { CampaignFiltersContext, FILTER_TYPES } from 'src/modules/CampaignFilters/context';
import NewOfferButton from 'src/scenes/Campaigns/components/NewOfferButton';
import { PageHeader, PageFiltersGroup } from '@adnz/ui';
import AccountFilterSelect from 'src/modules/CampaignFilters/AgencySelect';
import { DATE_ISO } from '@adnz/api-helpers';
import { CampaignPositionType } from '@adnz/api-ws-salesforce';
import StatusFilter, { StatusFilterEntity } from '../StatusFilter';
import Flight from './Flight';
import * as selectors from './selectors';

export interface IFlightsTableContainer {
  type: string
  renderFilter: () => React.ReactNode
  campaignPositionType: CampaignPositionType
}

const FlightsTableContainer: React.FC<IFlightsTableContainer> = ({
  type,
  renderFilter,
  campaignPositionType,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  // @ts-expect-error Expected 1 arguments, but got 2.ts(2554)
  const query = useSelector((state) => getSelectedQuery(state, { type: 'flights' }));
  // @ts-expect-error Expected 1 arguments, but got 2.ts(2554)
  const items = useSelector((state) => selectors.getIds(state, { instance: `flights-${type}` }));
  // @ts-expect-error Expected 1 arguments, but got 2.ts(2554)
  const amountHasData = useSelector((state) => selectors.amountHasData(state, { instance: `flights-${type}` }));
  // @ts-expect-error Expected 1 arguments, but got 2.ts(2554)
  const total = useSelector((state) => selectors.getTotal(state, { instance: `flights-${type}` }));
  const { ADMIN: isAmountNet2Sortable } = useIdentityRoles();
  const {
    filters, changeFilter, selectFilter, selectedFilter,
  } = React.useContext(CampaignFiltersContext);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getFlights(args, `flights-${type}`)),
    [dispatch, type],
  );

  /**
   * Temporary solution
   */
  React.useEffect(
    () => {
      if (selectedFilter === FILTER_TYPES.PUBLICATION_DATE) {
        changeFilter(FILTER_TYPES.PUBLICATION_DATE, null);
        selectFilter(null);
      }
    },
    [selectedFilter, changeFilter, selectFilter],
  );

  return (
    <>
      <StatusFilter entity={StatusFilterEntity.DIGITAL} />
      <PageHeader
        title={t('serviceDashboard:DIGITAL_POSITIONS')}
        actions={(<NewOfferButton />)}
      >
        <PageFiltersGroup css="max-width: 100%;margin-bottom: -5px;">
          <PageHeader.Search><SearchFilter type="flights" /></PageHeader.Search>
          <PageHeader.Select><AccountFilterSelect /></PageHeader.Select>
          {renderFilter && (
            <PrivateRoute
              roles={Roles.BOOK_CAMPAIGNS}
              render={renderFilter}
            />
          )}
        </PageFiltersGroup>
      </PageHeader>
      <Container>
        <div className="table-container table-container-mobile" id="positons-view-table-container">
          <InfiniteTable
            key={type}
            instance={`flights-${type}`}
            endpoint={endpoint}
            query={{
              type,
              searchQuery: query,
              advertiserIdFilter: filters.advertiser ? filters.advertiser.id : null,
              ownerFilter: filters.owner ? filters.owner.name : null,
              accountIdFilter: filters.agency ? filters.agency.id : null,
              stage: filters.stage,
              campaignTypeName: filters.type ? filters.type.name : null,
              startDateFrom: filters.startDate ? filters.startDate[0].format(DATE_ISO) : null,
              startDateTo: filters.startDate ? filters.startDate[1].format(DATE_ISO) : null,
              endDateFrom: filters.endDate ? filters.endDate[0].format(DATE_ISO) : null,
              endDateTo: filters.endDate ? filters.endDate[1].format(DATE_ISO) : null,
              createdByUserId: filters.createdBy ? filters.createdBy.id : undefined,
              campaignPositionType,
              industryId: filters.industry?.id,
            }}
            items={items}
            limit={20}
            total={total}
            idField={(id: string) => id}
            fields={[
              {
                key: 'status_delivery',
                name: t('serviceDashboard:'),
              },
              {
                key: 'name',
                name: t('serviceDashboard:FLIGHT_NAME'),
                sortable: true,
              },
              {
                key: 'fromDate',
                name: t('serviceDashboard:START_DATE'),
                sortable: true,
              },
              {
                key: 'toDate',
                name: t('serviceDashboard:END_DATE'),
                sortable: true,
              },
              {
                key: 'totalItems',
                name: t('serviceDashboard:TOTAL_ITEMS'),
              },
              {
                key: 'deliveredItems',
                name: t('serviceDashboard:DELIVERED'),
              },
              {
                key: 'deliveryRate',
                name: t('serviceDashboard:DELIVERY_INDICATOR'),
                sortable: true,
              },
              {
                key: 'ctr',
                name: t('serviceDashboard:CTR'),
                sortable: true,
              },
              {
                key: 'viewability',
                name: t('serviceDashboard:VISIBILITY'),
                sortable: true,
                className: 'text-left',
              },
              {
                key: 'amountNet2',
                name: t('serviceDashboard:AMOUNT_NET2'),
                sortable: isAmountNet2Sortable,
                visible: amountHasData,
              },
            ]}
            defaultOrderField={['RUNNING', 'ARCHIVED'].includes(type) ? 'toDate' : 'fromDate'}
            defaultOrderDirection={['ARCHIVED'].includes(type) ? 'desc' : 'asc'}
            rowRenderer={(itemId: string, fields: Map<string, unknown>, index: number) => (
              <Flight
                key={itemId}
                index={index}
                itemId={itemId}
                type={type}
              />
            )}
            scrollThreshold={0.6}
            height={0}
          />
        </div>
      </Container>
    </>
  );
};

export default FlightsTableContainer;
