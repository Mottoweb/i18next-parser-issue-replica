import React from 'react';
import {
  Container,
} from 'styled-bootstrap-grid';
import { PageHeader, Button } from '@adnz/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import PropTypes from 'prop-types';
import FormModal from './containers/Modal';
import Topic from './containers/Topic';
import * as actions from './actions';
import * as selectors from './selectors';
import Filter from './containers/Filter';

const TaskTopicList = ({
  subNav,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const nameFilter = useSelector(selectors.getFilterAppliedValue);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getTaskTopics(Object.assign(args.filters, {
      limit: args.limit,
      page: args.page,
      sort: args.sort,
      order: args.order,
    })), args.token),
    [dispatch],
  );
  const openModal = React.useCallback(
    () => dispatch(actions.openModal()),
    [dispatch],
  );
  return (
    <>
      {subNav}
      <PageHeader
        title={t('serviceDashboard:TASK_TOPICS')}
        actions={(<Button onClick={openModal} id="create-topic-button">{t('serviceDashboard:CREATE_TOPIC')}</Button>)}
        children={(<Filter />)}
      />
      <Container>
        <FormModal />
        <div id="infinite-table">
          <InfiniteTable
            instance="TaskTopics"
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
                key: 'description',
                name: t('serviceDashboard:DESCRIPTION'),
              },
              {
                key: 'action',
                name: '',
              },
            ]}
            defaultOrderField="name"
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

TaskTopicList.propTypes = {
  subNav: PropTypes.element.isRequired,
};

export default TaskTopicList;
