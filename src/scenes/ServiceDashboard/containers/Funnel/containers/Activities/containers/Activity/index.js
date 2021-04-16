import React from 'react';
import {
  useDispatch, useSelector,
} from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Link,
} from 'react-router-dom';
import Linkify from 'react-linkify';
import DateTime from 'src/components/DateTime';
import {
  push,
} from 'connected-react-router';
import ActivityItem from 'src/components/ActivityItem';
import { fromDateTimeType } from '@adnz/api-helpers';
import EditForm from '../EditForm';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const Activity = ({
  activityId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const activity = useSelector((state) => selectors.getActivity(state, { itemId: activityId }));
  const contact = useSelector((state) => selectors.getActivityContact(state, { itemId: activityId }));
  const editActivityId = useSelector(selectors.getEditActivityId);
  const taskId = useSelector((state) => selectors.getActivityTaskId(state, { itemId: activityId }));
  const dispatch = useDispatch();
  const navigateToTask = React.useCallback(
    () => dispatch(push(`/workflows/salesFunnel/all/${taskId}`)),
    [dispatch, taskId],
  );
  const openEditForm = React.useCallback(
    () => dispatch(actions.openActivityEditForm(activityId)),
    [dispatch, activityId],
  );
  const removeActivity = React.useCallback(
    () => dispatch(actions.deleteActivity(activityId)),
    [dispatch, activityId],
  );
  const closeEditForm = React.useCallback(
    () => dispatch(actions.closeActivityEditForm()),
    [dispatch],

  );
  return (
    <tbody className="dash-tbody">
      <tr>
        <td css="text-align: left!important; background-color: transparent!important;padding: 0!important;">
          <div data-testid="comments-box-container">
            {editActivityId === activityId
              ? <EditForm activityId={editActivityId} onSubmit={closeEditForm} />
              : (
                <ActivityItem
                  creator={(
                    <>
                      <span>{t(activity.get('creatorName'))}</span>
                      <span>
                        {' '}
                        (
                        {t(activity.get('activityType'))}
                      </span>
                      {!!activity.get('date')
                    && (
                      <span>
                        {' '}
                        -
                        <DateTime value={fromDateTimeType(activity.get('date'))} showLocal />
                      </span>
                    )}
                      <span>
                        ,&nbsp;
                        <Link to={`/buy-side/accounts/${activity.get('entityId')}`}>
                          {t(activity.get('entityName'))}
                        </Link>
                      </span>
                      {!!contact
                    && (
                      <span>
                        ,
                        {t(contact.get('name'))}
                      </span>
                    )}
                      {!!taskId
                    && (
                      <span>
                        ,&nbsp;
                        {!!taskId && (
                          <Link to={`/workflows/salesFunnel/all/${taskId}`}>
                            task
                            {' '}
                            {taskId}
                          </Link>
                        )}
                      </span>
                    )}
                      )
                      <span data-testid="activity-title">
                        {' '}
                        {t(activity.get('title'))}
                      </span>
                    </>
                )}
                  icon={activity.get('activityType')}
                  date={(<DateTime value={fromDateTimeType(activity.get('creationDate'))} showLocal />)}
                  message={(<Linkify properties={{ target: '_blank' }}>{activity.get('message')}</Linkify>)}
                  onEdit={openEditForm}
                  onDelete={removeActivity}
                  onClick={taskId ? navigateToTask : null}
                />
              )}
          </div>
        </td>
      </tr>
    </tbody>
  );
};

Activity.propTypes = {
  activityId: PropTypes.string.isRequired,
};

export default Activity;
