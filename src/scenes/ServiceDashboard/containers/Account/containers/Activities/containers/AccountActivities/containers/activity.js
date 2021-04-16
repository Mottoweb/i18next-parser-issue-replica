import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Linkify from 'react-linkify';
import DateTime from 'src/components/DateTime';
import { getValue } from 'src/components/ReactSelectV2Field';
import {
  push,
} from 'connected-react-router';
import c from 'classnames';
import * as funnelActions from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Activities/actions';
import ActivityItem from 'src/components/ActivityItem';
import { fromDateTimeType } from '@adnz/api-helpers';
import * as selectors from '../../../../../selectors';
import * as actions from '../../../../../actions';
import EditForm from './EditForm';

const Comment = ({
  activityId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const activity = useSelector((state) => selectors.getActivity(state, { itemId: activityId }));
  const taskId = useSelector((state) => selectors.getActivityTaskId(state, { itemId: activityId }));
  const editActivityId = useSelector(selectors.getEditActivityId);
  const dispatch = useDispatch();
  const navigateToTask = React.useCallback(
    () => {
      if (taskId) {
        dispatch(push(`/workflows/salesFunnel/all/${taskId}`));
      }
    },
    [dispatch, taskId],
  );
  const openEditForm = React.useCallback(
    () => dispatch(actions.openActivityEditForm(activityId)),
    [dispatch, activityId],
  );
  const deleteActivity = React.useCallback(
    () => dispatch(actions.deleteActivity(activityId)),
    [dispatch, activityId],
  );
  const updateActivity = React.useCallback(
    (data) => {
      dispatch(funnelActions.editActivity(activityId,
        {
          id: data.get('id'),
          entityId: getValue(data.get('entityId')),
          message: data.get('message'),
          contact: data.get('contactId') ? { id: getValue(data.get('contactId')) } : null,
          title: data.get('title'),
          date: data.get('date'),
          activityType: getValue(data.get('activityType')),
          entityType: 'ACCOUNT',
          tags: data.get('tags', []).map((tag) => ({ id: tag.value, name: tag.label })),
        }));
      dispatch(actions.closeActivityEditForm());
    },
    [activityId, dispatch],
  );
  return (
    <tbody className={c('dash-tbody', 'comments-box-container', { hover: !!taskId })}>
      <tr>
        <td css="text-align: left!important; padding: 0!important;">
          {editActivityId === activityId
            ? <EditForm activityId={editActivityId} onSubmit={updateActivity} />
            : (
              <ActivityItem
                creator={t(activity.get('creatorName'))}
                type={t(activity.get('activityType'))}
                icon={activity.get('activityType')}
                date={(<DateTime value={fromDateTimeType(activity.get('date'))} showLocal />)}
                message={(<Linkify properties={{ target: '_blank' }}>{activity.get('message')}</Linkify>)}
                onEdit={openEditForm}
                onDelete={deleteActivity}
                onClick={navigateToTask}
              />
            )}
        </td>
      </tr>
    </tbody>
  );
};

Comment.propTypes = {
  activityId: PropTypes.string.isRequired,
};

export default Comment;
