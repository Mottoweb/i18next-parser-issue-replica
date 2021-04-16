import React, { useContext } from 'react';
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
  getActive as getActiveSource,
} from '../../../SourcesSelect/selectors';
import {
  getActive as getActiveLabel,
} from '../../../LabelSelect/selectors';
import {
  getActive as getActiveUser,
} from '../../../UserSelect/selectors';

const InProgress = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const items = useSelector((state) => selectors.getTaskIds(state, { instance: 'tasks-all' }));
  const total = useSelector((state) => selectors.getTaskTotal(state, { instance: 'tasks-all' }));
  const selectedSource = useSelector(getActiveSource);
  const selectedLabel = useSelector(getActiveLabel);
  const selectedUser = useSelector(getActiveUser);
  const { filters } = useContext(CampaignFiltersContext);
  const topicFilter = useSelector(getSelectedTopicId);
  const { onlyImportant } = useContext(TaskFilterContext);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getTasks(args, 'tasks-all')),
    [dispatch],
  );
  return (
    <div className="table-container-mobile" id="tasks-table-all">
      <InfiniteTable
        instance="tasks-all"
        endpoint={endpoint}
        items={items}
        query={{
          assigneeId: selectedUser,
          sourceId: selectedSource,
          labelId: selectedLabel,
          onlyImportant,
          accountId: filters.agency ? filters.agency.id : null,
          topicFilter,
        }}
        limit={25}
        total={total}
        idField={(id) => id}
        fields={[
          {
            key: 'status',
            name: t('serviceDashboard:STATUS'),
            sortable: true,
          },
          {
            key: 'created',
            name: t('serviceDashboard:CREATED'),
            sortable: true,
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
            key: 'account.name',
            name: t('serviceDashboard:ACCOUNT'),
            sortable: false,
          },
          {
            key: 'campaign.name',
            name: t('serviceDashboard:CAMPAIGN'),
            sortable: false,
          },
          {
            key: 'assignee.name',
            name: t('serviceDashboard:ASSIGNEE'),
            sortable: false,
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
            key: 'taskTopic',
            name: t('serviceDashboard:TASK_TOPIC'),
            sortable: true,
          },
          {
            key: 'activitiesCount',
            name: t('serviceDashboard:LAST_ACTIVITY'),
            sortable: false,
          },
        ]}
        defaultOrderField="created"
        defaultOrderDirection="desc"
        rowRenderer={(id) => (
          <TaskItem key={id} itemId={id} />
        )}
      />
    </div>
  );
};

export default InProgress;
