import React from 'react';
import {
  Container,
} from 'styled-bootstrap-grid';
import { PageHeader } from '@adnz/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import PropTypes from 'prop-types';
import FormModal from './containers/Modal';
import Tag from './containers/Tag';
import * as actions from './actions';
import * as selectors from './selectors';
import Filter from './containers/Filter';

const TagsList = ({
  subNav,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const nameFilter = useSelector(selectors.getFilterAppliedValue);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getTags(args, 'Tags')),
    [dispatch],
  );
  return (
    <>
      {subNav}
      <PageHeader title={t('serviceDashboard:SALESFUNNEL_LABELS')}>
        <Filter />
      </PageHeader>
      <Container>
        <FormModal />
        <div id="labels-infinite-table">
          <InfiniteTable
            instance="Tags"
            endpoint={endpoint}
            items={items}
            limit={20}
            query={{ nameFilter }}
            total={total}
            idField={(id) => id}
            fields={[
              {
                key: 'name',
                name: t('serviceDashboard:NAME'),
                sortable: true,
              },
              {
                key: 'created',
                name: t('serviceDashboard:CREATED'),
                sortable: true,
              },
              {
                key: 'lastAddedLead',
                name: t('serviceDashboard:LAST_ADDED_LEAD'),
              },
              {
                key: 'task',
                name: t('serviceDashboard:TASK'),
              },
              {
                key: 'action',
                name: '',
              },
            ]}
            defaultOrderField="name"
            defaultOrderDirection="asc"
            rowRenderer={(id) => (
              <Tag key={id} itemId={id} />
            )}
          />
        </div>
      </Container>
    </>
  );
};

TagsList.propTypes = {
  subNav: PropTypes.element.isRequired,
};

export default TagsList;
