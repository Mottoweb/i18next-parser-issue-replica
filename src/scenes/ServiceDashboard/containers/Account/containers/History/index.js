import React from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'src/components/SectionTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@adnz/ui';
import Table from 'src/modules/Table';
import { isPermissionsToAccount } from 'src/selectors';
import * as actions from './actions';
import * as selectors from './selectors';
import Item from './Item';

const History = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    () => dispatch(actions.getActivities(itemId)),
    [dispatch, itemId],
  );
  return (
    <>
      <SectionTitle>
        {t('serviceDashboard:HISTORY')}
      </SectionTitle>
      <Table
        instance="account-history"
        endpoint={endpoint}
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
        rowRenderer={(id) => (
          <Item key={id} itemId={id} />
        )}
      />
      <ButtonGroup align="right">
        <Button
          data-testid="show-more-history-table"
          onClick={() => history.push(`/buy-side/accounts/${itemId}/history`)}
          theme="create-secondary"
        >
          {t('serviceDashboard:SHOW_MORE')}
        </Button>
      </ButtonGroup>
    </>
  );
};

History.propTypes = {
  itemId: PropTypes.string.isRequired,
};

const HistoryWrapper = ({ itemId }) => {
  const visible = useSelector((state) => isPermissionsToAccount(state, { itemId }));
  if (!visible) {
    return null;
  }

  return (
    <History itemId={itemId} />
  );
};

HistoryWrapper.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default HistoryWrapper;
