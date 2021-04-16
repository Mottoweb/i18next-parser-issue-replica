import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
} from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import { PageHeader } from '@adnz/ui';
import * as actions from './actions';
import * as selectors from './selectors';
import DealRow from './containers/Row';

const Deals = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.get(args)),
    [dispatch],
  );
  return (
    <>
      <PageHeader title={t('serviceDashboard:DEALS')} fluid />
      <Container fluid>
        <div className="table-container-mobile" id="deals-table">
          <div className="graph-box">
            <InfiniteTable
              instance="Deals"
              endpoint={endpoint}
              items={items}
              limit={20}
              total={total}
              idField={(id) => id}
              fields={[
                {
                  key: 'id',
                  name: t('serviceDashboard:ID_FIELD'),
                },
                {
                  key: 'name',
                  name: t('serviceDashboard:NAME'),
                  sortable: true,
                },
                {
                  key: 'active',
                  name: t('serviceDashboard:ACTIVE'),
                  sortable: true,
                },
                {
                  key: 'startDate',
                  name: t('serviceDashboard:START_DATE'),
                  sortable: true,
                },
                {
                  key: 'endDate',
                  name: t('serviceDashboard:END_DATE'),
                  sortable: true,
                },
                {
                  key: 'buyerName',
                  name: t('serviceDashboard:BUYER_NAME'),
                  sortable: true,
                },
                {
                  key: 'askPrice',
                  name: t('serviceDashboard:ASK_PRICE'),
                  sortable: true,
                },
                {
                  key: 'currency',
                  name: t('serviceDashboard:CURRENCY'),
                  sortable: true,
                },
                {
                  key: 'auctionType',
                  name: t('serviceDashboard:AUCTION_TYPE'),
                  sortable: true,
                },
                {
                  key: 'lastModifiedDate',
                  name: t('serviceDashboard:LAST_MODIFIED'),
                  sortable: true,
                },
                {
                  key: 'impressionsMatched',
                  name: t('serviceDashboard:IMPRESSION_MATCHED'),
                  sortable: false,
                },
                {
                  key: 'bidRequests',
                  name: t('serviceDashboard:BID_REQUESTS'),
                  sortable: false,
                },
                {
                  key: 'bids',
                  name: t('serviceDashboard:BIDS'),
                  sortable: false,
                },
                {
                  key: 'sellerRevenue',
                  name: t('serviceDashboard:SELLER_REVENUE'),
                  sortable: false,
                },
              ]}
              defaultOrderField="name"
              defaultOrderDirection="asc"
              rowRenderer={(itemId) => (
                <DealRow key={itemId} itemId={itemId} />
              )}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Deals;
