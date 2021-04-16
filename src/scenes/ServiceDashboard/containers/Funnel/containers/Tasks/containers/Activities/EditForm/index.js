import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getValue } from 'src/components/ReactSelectV2Field';
import { Section } from '@adnz/ui';
import Form from './form';
import * as actions from '../actions';
import * as selectors from '../selectors';

const EditForm = ({
  taskId,
  activityId,
}) => {
  const initialValues = useSelector(
    (state) => selectors.getActivityInitialValues(state, { itemId: activityId }),
  );
  const dispatch = useDispatch();
  const updateActivity = React.useCallback(
    (data) => dispatch(actions.editActivity(
      {
        entityId: data.get('entityId'),
        message: data.get('message'),
        contact: data.get('contactId') ? { id: getValue(data.get('contactId')) } : null,
        title: data.get('title'),
        date: data.get('date'),
        activityType: getValue(data.get('activityType')),
        entityType: data.get('entityType'),
        id: data.get('id'),
        taskId,
      },
    )),
    [dispatch, taskId],
  );
  return (
    <Section>
      <Form
        key={activityId}
        form={`edit-activity-${activityId}`}
        initialValues={initialValues}
        onSubmit={updateActivity}
      />
    </Section>
  );
};

EditForm.propTypes = {
  activityId: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
};

export default EditForm;
