import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
} from 'styled-bootstrap-grid';
import SectionTitle from 'src/components/SectionTitle';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteTable from 'src/modules/InfiniteTable';
import {
  Route,
  Link,
} from 'react-router-dom';
import { Button } from '@adnz/ui';
import * as actions from './actions';
import * as selectors from './selectors';
import Item from './item';

const History = ({
  renderUpperMenu,
  campaignId,
  accountId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getActivities(args)),
    [dispatch],
  );
  return (
    <>
      {!!renderUpperMenu && renderUpperMenu()}
      <Container>
        <SectionTitle data-testid="back-to-account-button">
          <span>{t('serviceDashboard:HISTORY')}</span>
          {campaignId && (
            <Route
              path="/buy-side/campaigns/:type(ALL|OFFERED|DRAFTS|APPROVALS|BOOKED|RUNNING|ARCHIVED)/:campaignId"
              render={({ match }) => (
                <Button
                  as={Link}
                  to={`/buy-side/campaigns/${match.params.type}/${match.params.campaignId}`}
                  theme="create-secondary"
                >
                  {t('serviceDashboard:BACK_TO_CAMPAIGN')}
                </Button>
              )}
            />
          )}
          {accountId && (
            <Route
              render={() => (
                <Button
                  as={Link}
                  to={`/buy-side/accounts/${accountId}/`}
                  theme="create-secondary"
                >
                  {t('serviceDashboard:BACK_TO_CAMPAIGN')}
                </Button>
              )}
            />
          )}
        </SectionTitle>
        <div className="table-container-mobile">
          <div
            data-testid="history-table-separate-page"
            className="table-responsive"
          >
            <InfiniteTable
              instance="campaign-history"
              endpoint={endpoint}
              query={{
                campaignId,
                accountId,
              }}
              items={items}
              limit={20}
              total={total}
              idField={(id) => id}
              fields={[
                {
                  key: 'creationDate',
                  name: t('serviceDashboard:DATE'),
                  sortable: true,
                },
                {
                  key: 'name',
                  name: t('serviceDashboard:NAME'),
                },
                {
                  key: 'field',
                  name: t('serviceDashboard:FIELD'),
                },
                {
                  key: 'oldValue',
                  name: t('serviceDashboard:OLD_VALUE'),
                },
                {
                  key: 'newValue',
                  name: t('serviceDashboard:NEW_VALUE'),
                },
              ]}
              defaultOrderField="creationDate"
              defaultOrderDirection="desc"
              rowRenderer={(itemId) => (
                <Item key={itemId} itemId={itemId} />
              )}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

History.propTypes = {
  renderUpperMenu: PropTypes.func.isRequired,
  campaignId: PropTypes.string,
  accountId: PropTypes.string,
};

History.defaultProps = {
  accountId: undefined,
  campaignId: undefined,
};

export default History;
