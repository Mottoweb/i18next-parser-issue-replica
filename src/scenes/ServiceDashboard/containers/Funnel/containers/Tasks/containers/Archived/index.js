import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import { CampaignFiltersContext } from 'src/modules/CampaignFilters/context';
import {
  getActiveId as getSelectedTopicId,
} from 'src/scenes/ServiceDashboard/containers/Funnel/containers/TopicSelect/selectors';
import { TaskFilterContext } from '../../../RocketFilter/context';
import TaskItem from './taskItem';
import RestoreModal from './containers/RestoreModal';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import {
  getActive as getActiveLabel,
} from '../../../LabelSelect/selectors';
import {
  getActive as getActiveSource,
} from '../../../SourcesSelect/selectors';

const Leads = ({
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
  const selectedLabel = useSelector(getActiveLabel);
  const { onlyImportant } = useContext(TaskFilterContext);
  const { filters } = useContext(CampaignFiltersContext);
  return (
    <div className="table-container table-container-mobile" id="tasks-table-archived">
      <RestoreModal />
      <InfiniteTable
        instance={`tasks-${status}`}
        endpoint={endpoint}
        items={items}
        query={{
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
            key: 'created',
            name: t('serviceDashboard:CREATED'),
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
            key: 'creator.name',
            name: t('serviceDashboard:CREATOR'),
            sortable: false,
          },
          {
            key: 'accountSalesName',
            name: t('serviceDashboard:ACCOUNT_SALES'),
            sortable: true,
          },
          {
            key: 'outcome',
            name: t('serviceDashboard:REASON'),
            sortable: true,
          },
          {
            key: 'activitiesCount',
            name: '',
          },
          {
            key: 'button',
            name: '',
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

Leads.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Leads;
