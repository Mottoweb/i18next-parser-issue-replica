import React from 'react';
import PropTypes from 'prop-types';
import {
  useSelector, useDispatch,
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Link,
} from 'react-router-dom';
import {
  push,
} from 'connected-react-router';
import { ICONS } from 'src/constants';
import Colors from 'src/theme/Colors';
import {
  Icons, Tag, Table, Button,
} from '@adnz/ui';
import { fromDateTimeType } from '@adnz/api-helpers';
import CustomCell from 'src/components/CustomCell';
import * as helpers from 'src/scenes/Campaigns/helpers';
import * as selectors from '../../selectors';
import AssigneeSelector from '../AssigneeSelector';
import * as actions from '../../actions';
import LastComment from '../LastComment';

const stopPropagation = (evt) => evt.stopPropagation();

const TaskItem = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const task = useSelector((state) => selectors.getTask(state, { itemId }));
  const account = useSelector((state) => selectors.getAccountByTaskId(state, { itemId }));
  const activity = useSelector((state) => selectors.getActivityByTaskId(state, { itemId }));
  const source = useSelector((state) => selectors.getSourceByTaskId(state, { itemId }));
  const taskTopic = useSelector((state) => selectors.getTaskTopicByTaskId(state, { itemId }));
  const isDeleting = useSelector((state) => selectors.isDeletingLead(state, { itemId }));
  const statusMessage = useSelector((state) => selectors.getTaskStatusMessage(state, { itemId }));
  const tags = useSelector((state) => selectors.getTagsByTaskId(state, { itemId }));
  const statusColorPropertyName = helpers.getStatusColor(task.get('activityStatusColor'));
  const creator = useSelector((state) => selectors.getCreatorByTaskId(state, { itemId }));
  const dispatch = useDispatch();
  const navigateToDetails = React.useCallback(
    () => dispatch(push(`/workflows/salesFunnel/leads/${itemId}`)),
    [itemId, dispatch],
  );
  const openDeleteModal = React.useCallback(
    () => dispatch(actions.openDeleteModal(itemId)),
    [itemId, dispatch],
  );
  return (
    <Table.Tr onClick={navigateToDetails}>
      <Table.Td
        statusColor={statusColorPropertyName}
        statusTooltip={t(statusMessage)}
      />
      <Table.Td title={t('serviceDashboard:IMPORTANT')}>
        {!!task.get('isImportant') && <span>{String.fromCodePoint(ICONS.ROCKET)}</span>}
      </Table.Td>
      <Table.Td title={t('serviceDashboard:PRIORITY')}>
        {t(task.get('priority'))}
      </Table.Td>
      <Table.Td title={t('serviceDashboard:TASK_TOPIC')}>
        {t(taskTopic?.get('name'))}
      </Table.Td>
      <CustomCell.Date
        value={fromDateTimeType(task.get('created'))}
        title={t('serviceDashboard:CREATED')}
      />
      <Table.Td title={t('serviceDashboard:ACCOUNT')}>
        <span onClick={stopPropagation}>
          <Link to={`/buy-side/accounts/${account.get('id')}`}>{account.get('displayName')}</Link>
        </span>
      </Table.Td>
      <Table.Td title={t('serviceDashboard:LEAD_SOURCE')}>
        {source.get('name')}
      </Table.Td>
      <Table.Td title={t('serviceDashboard:LABELS')}>
        <Tag.Group>
          {tags.map((tag) => (
            <Tag
              key={tag.get('id')}
              value={tag.get('name')}
              color={Colors['adnz-green']}
            />
          ))}
        </Tag.Group>
      </Table.Td>
      <Table.Td title={t('serviceDashboard:CREATOR')}>
        {creator.get('name')}
      </Table.Td>
      <Table.Td title={t('serviceDashboard:ACCOUNT_SALES')}>
        {task.get('accountSalesName')}
      </Table.Td>
      <Table.Td title={t('serviceDashboard:ASSIGNEE')}>
        <span onClick={stopPropagation}>
          <Table.Field>
            <AssigneeSelector taskId={itemId} />
          </Table.Field>
        </span>
      </Table.Td>
      <Table.Td title={t('serviceDashboard:LAST_ACTIVITY')}>
        <LastComment activity={activity} activitiesCount={task.get('activitiesCount')} />
      </Table.Td>
      <Table.Td onClick={stopPropagation}>
        <Button
          theme="delete"
          onClick={openDeleteModal}
          disabled={isDeleting}
          square
        >
          <Icons.Trash color="#fff" />
        </Button>
      </Table.Td>
    </Table.Tr>
  );
};

TaskItem.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default TaskItem;
