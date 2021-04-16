import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import { Button, ButtonGroup } from '@adnz/ui';
import Activity from '../Activity';
import * as selectors from '../selectors';
import * as actions from '../actions';

const ActivityTable = ({
  taskId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const ids = useSelector(selectors.idsActivities);
  const isShownButtons = useSelector(selectors.isShownButtons);
  const isShownAll = useSelector(selectors.isShownAllActivities);
  const dispatch = useDispatch();
  const { execute: showAll } = useEffectWithToken(
    (token) => {
      dispatch(actions.showAllActivities(token));
      dispatch(actions.getActivities(taskId, token));
    },
    [taskId],
  );
  const { execute: showLess } = useEffectWithToken(
    (token) => {
      dispatch(actions.showLessActivities(token));
      dispatch(actions.getActivities(taskId, token));
    },
    [taskId, dispatch],
  );
  React.useEffect(() => {
    dispatch(actions.showLessActivities());
  }, [dispatch]);
  useEffectWithToken(
    (token) => dispatch(actions.getActivities(taskId, token)),
    [taskId],
    true,
  );
  return (
    <>
      <div css="margin-top: 5px;">
        {!!ids && ids.map((activityId) => (
          <Activity key={activityId} activityId={activityId} taskId={taskId} />
        ))}
      </div>
      <div className="spacer" />
      {isShownButtons && (
        <ButtonGroup align="right">
          <Button
            theme="create-secondary"
            onClick={isShownAll ? showLess : showAll}
            data-testid="all-activities-show-less-button"
          >
            {isShownAll ? t('serviceDashboard:SHOW_LESS') : t('serviceDashboard:ALL_ACTIVITIES')}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
};

ActivityTable.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default ActivityTable;
