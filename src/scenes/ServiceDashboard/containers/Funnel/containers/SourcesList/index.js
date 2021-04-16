import React from 'react';
import {
  Container,
} from 'styled-bootstrap-grid';
import { Button, PageHeader } from '@adnz/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import PropTypes from 'prop-types';
import FormModal from './containers/Modal';
import BatchTaskModal from './containers/BatchTasksModal';
import DescriptionModal from './containers/DescriptionModal';
import Source from './containers/Source';
import * as actions from './actions';
import * as selectors from './selectors';
import Filter from './containers/Filter';

const SourcesList = ({
  subNav,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const nameFilter = useSelector(selectors.getFilterAppliedValue);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getSources(args, 'Sources')),
    [dispatch],
  );
  const create = React.useCallback(
    () => dispatch(actions.openModal()),
    [dispatch],
  );
  return (
    <>
      {subNav}
      <FormModal />
      <DescriptionModal />
      <BatchTaskModal />
      <PageHeader
        title={t('serviceDashboard:SOURCES')}
        actions={(<Button onClick={create} id="create-source-button" s>{t('serviceDashboard:CREATE_SOURCE')}</Button>)}
      >
        <Filter />
      </PageHeader>
      <Container>
        <div id="sources-infinite-table">
          <InfiniteTable
            instance="Sources"
            endpoint={endpoint}
            items={items}
            limit={20}
            total={total}
            idField={(id) => id}
            query={{ nameFilter }}
            fields={[
              {
                key: 'name',
                name: t('serviceDashboard:NAME'),
                sortable: true,
              },
              {
                key: 'priority',
                name: t('serviceDashboard:PRIORITY'),
                sortable: true,
              },
              {
                key: 'lastTaskDate',
                name: t('serviceDashboard:LAST_TASK_DATE'),
                sortable: false,
              },
              {
                key: 'action',
                name: '',
              },
            ]}
            defaultOrderField="name"
            defaultOrderDirection="asc"
            rowRenderer={(id) => (
              <Source key={id} itemId={id} />
            )}
          />
        </div>
      </Container>
    </>
  );
};

SourcesList.propTypes = {
  subNav: PropTypes.element.isRequired,
};

export default SourcesList;
