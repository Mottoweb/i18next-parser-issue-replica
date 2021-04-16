import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
} from 'styled-bootstrap-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import { CampaignFiltersContext } from 'src/modules/CampaignFilters/context';
import { PageHeader } from '@adnz/ui';
import Meeting from './containers/Meeting';
import * as actions from './actions';
import * as selectors from './selectors';
import {
  getActiveId as getSelectedTopicId,
} from '../TopicSelect/selectors';
import {
  getActiveTimeframeId,
} from '../TimeframeSelect/selectors';
import {
  getActiveId as getSelectedCreatorId,
} from '../CommentCreatorSelect/selectors';

const Meetings = ({ filtersGroup }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { filters } = useContext(CampaignFiltersContext);
  const items = useSelector(selectors.getIds);
  const total = useSelector(selectors.getTotal);
  const selectedTopicId = useSelector(getSelectedTopicId);
  const selectedTimeframe = useSelector(getActiveTimeframeId);
  const selectedCreatorId = useSelector(getSelectedCreatorId);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getMeetings({
      ...args.filters,
      limit: args.limit,
      page: args.page,
      sort: args.sort,
      order: args.order,
    }, args.token)),
    [dispatch],
  );
  return (
    <>
      <PageHeader
        title={t('serviceDashboard:MEETINGS')}
        children={filtersGroup}
      />
      <Container>
        <div id="meetings-table">
          <InfiniteTable
            instance="Meetings"
            endpoint={endpoint}
            items={items}
            limit={20}
            total={total}
            idField={(id) => id}
            query={{
              accountId: filters.agency ? filters.agency.id : null,
              topicId: selectedTopicId,
              dateTimeFrame: selectedTimeframe,
              creatorId: selectedCreatorId,
            }}
            fields={[
              {
                key: 'title',
                name: t('serviceDashboard:TITLE'),
                sortable: true,
              },
              {
                key: 'date',
                name: t('serviceDashboard:MEETING_DATE'),
                sortable: true,
              },
              {
                key: 'contact',
                name: t('serviceDashboard:CONTACT'),
              },
              {
                key: 'task',
                name: t('serviceDashboard:TASK'),
              },
              {
                key: 'topics',
                name: t('serviceDashboard:TOPICS'),
              },
            ]}
            defaultOrderField="title"
            defaultOrderDirection="asc"
            rowRenderer={(id) => (
              <Meeting key={id} itemId={id} />
            )}
          />
        </div>
      </Container>
    </>
  );
};

Meetings.propTypes = {
  filtersGroup: PropTypes.node.isRequired,
};

export default Meetings;
