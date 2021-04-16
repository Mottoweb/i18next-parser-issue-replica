import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteTable from 'src/modules/InfiniteTable';
import { CampaignFiltersContext } from 'src/modules/CampaignFilters/context';
import { TaskFilterContext } from 'src/scenes/ServiceDashboard/containers/Funnel/containers/RocketFilter/context';
import TaskItem from './taskItem';
import DeleteModal from './containers/DeleteModal';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import {
  getActive as getActiveLabel,
} from '../../../LabelSelect/selectors';
import {
  getActive as getActiveSource,
} from '../../../SourcesSelect/selectors';
import { useSalesSelectContext } from '../../../SalesSelect/Context';
import { TableWrapper } from './styles';

const Leads = ({
  status,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getTasks(args, `tasks-${status}`)),
    [dispatch, status],
  );
  const [accountSales] = useSalesSelectContext();
  const { filters } = useContext(CampaignFiltersContext);
  const items = useSelector((state) => selectors.getTaskIds(state, { instance: `tasks-${status}` }));
  const total = useSelector((state) => selectors.getTaskTotal(state, { instance: `tasks-${status}` }));
  const selectedSource = useSelector(getActiveSource);
  const selectedLabel = useSelector(getActiveLabel);
  const { onlyImportant } = useContext(TaskFilterContext);

  return (
    <TableWrapper id="tasks-table-leads">
      <DeleteModal />
      <InfiniteTable
        instance={`tasks-${status}`}
        endpoint={endpoint}
        items={items}
        query={{
          sourceId: selectedSource,
          accountSales: accountSales?.label ?? null,
          labelId: selectedLabel,
          status,
          onlyImportant,
          accountId: filters.agency ? filters.agency.id : null,
        }}
        limit={25}
        total={total}
        idField={(id) => id}
        tbodyWrapper
        uiTable
        fields={[
          {
            key: 'lastActivityTime',
            name: '',
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
            key: 'taskTopic',
            name: t('serviceDashboard:TASK_TOPIC'),
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
            key: 'action',
            name: t('serviceDashboard:ASSIGNEE'),
            sortable: false,
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
    </TableWrapper>
  );
};

Leads.propTypes = {
  status: PropTypes.string,
};

Leads.defaultProps = {
  status: null,
};

export default Leads;
