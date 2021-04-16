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
import Topic from './containers/Topic';
import * as actions from './actions';
import * as selectors from './selectors';
import Filter from './containers/Filter';

const TopicList = ({
  subNav,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const nameFilter = useSelector(selectors.getFilterAppliedValue);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getTopics(Object.assign(args.filters, {
      limit: args.limit,
      page: args.page,
      sort: args.sort,
      order: args.order,
    })), args.token),
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
      <PageHeader
        title={t('serviceDashboard:TOPICS')}
        actions={(<Button onClick={create} id="create-topic-button">{t('serviceDashboard:CREATE_TOPIC')}</Button>)}
      >
        <Filter />
      </PageHeader>
      <Container>
        <div id="infinite-table">
          <InfiniteTable
            instance="Topics"
            endpoint={endpoint}
            items={items}
            limit={20}
            total={total}
            idField={(id) => id}
            query={{ nameFilter }}
            fields={[
              {
                key: 'title',
                name: t('serviceDashboard:TITLE'),
                sortable: true,
              },
              {
                key: 'description',
                name: t('serviceDashboard:DESCRIPTION'),
              },
              {
                key: 'action',
                name: '',
              },
            ]}
            defaultOrderField="title"
            defaultOrderDirection="asc"
            rowRenderer={(id) => (
              <Topic key={id} itemId={id} />
            )}
          />
        </div>
      </Container>
    </>
  );
};

TopicList.propTypes = {
  subNav: PropTypes.element.isRequired,
};

export default TopicList;
