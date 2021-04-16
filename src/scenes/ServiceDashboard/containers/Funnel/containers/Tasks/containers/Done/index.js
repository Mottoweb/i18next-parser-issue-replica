import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import { CampaignFiltersContext } from 'src/modules/CampaignFilters/context';
import { TaskFilterContext } from 'src/scenes/ServiceDashboard/containers/Funnel/containers/RocketFilter/context';
import {
  getActiveId as getSelectedTopicId,
} from 'src/scenes/ServiceDashboard/containers/Funnel/containers/TopicSelect/selectors';
import TaskItem from './taskItem';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import {
  getActive as getActiveLabel,
} from '../../../LabelSelect/selectors';
import {
  getActive as getActiveSource,
} from '../../../SourcesSelect/selectors';
import {
  getActive as getActiveUser,
} from '../../../UserSelect/selectors';
import {
  getActiveId,
} from '../../../OutcomeSelect/selectors';
import {
  getActiveTimeframeId,
} from '../../../TimeframeSelect/selectors';

const Done = ({
  status,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getTasks(args, `tasks-${status}`)),
    [dispatch, status],
  );
  const items = useSelector((state) => selectors.getTaskIds(state, { instance: `tasks-${status}` }));
  const total = useSelector((state) => selectors.getTaskTotal(state, { instance: `tasks-${status}` }));
  const topicFilter = useSelector(getSelectedTopicId);
  const selectedSource = useSelector(getActiveSource);
  const selectedUser = useSelector(getActiveUser);
  const selectedLabel = useSelector(getActiveLabel);
  const selectedOutcomeId = useSelector(getActiveId);
  const selectedTimeframeId = useSelector(getActiveTimeframeId);
  const { filters } = useContext(CampaignFiltersContext);
  const { onlyImportant } = useContext(TaskFilterContext);
  return (
    <div className="table-container table-container-mobile" id="tasks-table-done">
      <InfiniteTable
        instance={`tasks-${status}`}
        endpoint={endpoint}
        items={items}
        query={{
          updatedTimeFrame: selectedTimeframeId,
          outcomeFilter: selectedOutcomeId,
          assigneeId: selectedUser,
          sourceId: selectedSource,
          labelId: selectedLabel,
          status,
          onlyImportant,
          accountId: filters.agency ? filters.agency.id : null,
          topicFilter,
        }}
        limit={25}
        total={total}
        idField={(id) => id}
        fields={[
          {
            key: 'i',
            name: '',
          },
          {
            key: 'outcome',
            name: t('serviceDashboard:OUTCOME'),
            sortable: true,
          },
          {
            key: 'isImportant',
            name: t('serviceDashboard:IMPORTANT'),
            sortable: true,
          },
          {
            key: 'priority',
            name: t('serviceDashboard:PRIORITY'),
            sortable: true,
          },
          {
            key: 'statusChangedTime',
            name: t('serviceDashboard:FINISHED_TIME'),
            sortable: true,
          },
          {
            key: 'assignedTime',
            name: t('serviceDashboard:ASSIGNED_TIME'),
            sortable: true,
          },
          {
            key: 'account.name',
            name: t('serviceDashboard:ACCOUNT'),
            sortable: false,
          },
          {
            key: 'leadSource.name',
            name: t('serviceDashboard:LEAD_SOURCE'),
            sortable: true,
          },
          {
            key: 'tags',
            name: t('serviceDashboard:LABELS'),
          },
          {
            key: 'assignee.name',
            name: t('serviceDashboard:ASSIGNEE'),
            sortable: false,
          },
          {
            key: 'activitiesCount',
            name: t('serviceDashboard:LAST_ACTIVITY'),
            sortable: false,
          },
        ]}
        defaultOrderField="assignedTime"
        defaultOrderDirection="desc"
        rowRenderer={(id) => (
          <TaskItem key={id} itemId={id} />
        )}
      />
    </div>
  );
};

Done.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Done;
