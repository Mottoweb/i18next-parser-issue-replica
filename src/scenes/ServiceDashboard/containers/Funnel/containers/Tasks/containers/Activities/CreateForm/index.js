import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
} from 'immutable';
import { getValue } from 'src/components/ReactSelectV2Field';
import {
  setInitValuesDateTime,
} from 'src/helpers';
import { Section } from '@adnz/ui';
import Form from './form';
import * as actions from '../actions';
import * as selectors from '../selectors';

const CreateForm = ({
  taskId,
  accountId,
}) => {
  const initialValues2 = useSelector(
    (state) => selectors.getActivityCreateFormInitialValues(state, { itemId: accountId }),
  );
  const initialValues = React.useMemo(
    () => setInitValuesDateTime(initialValues2, 'date'),
    [initialValues2],
  );
  const dispatch = useDispatch();
  const createActivity = React.useCallback(
    (data) => {
      const form = {
        message: data.get('message'),
        entityId: data.get('entityId'),
        accountId: data.get('entityId'),
        activityType: getValue(data.get('activityType')),
        topicDiscussions: data.get('topics') ? data.get('topics').map((i) => i.value) : new List(),
        entityType: data.get('entityType'),
        contact: data.get('contactId') ? { id: getValue(data.get('contactId')) } : null,
        title: data.get('title'),
        date: data.get('date'),
        notifySales: data.get('notifySales'),
        taskId,
      };
      const isMeeting = form.activityType === 'MEETING';
      return dispatch(isMeeting ? actions.createMeeting(form) : actions.createActivity(form));
    },
    [taskId, dispatch],
  );
  return (
    <Section>
      <Form
        taskId={taskId}
        initialValues={initialValues}
        onSubmit={createActivity}
      />
    </Section>
  );
};

CreateForm.propTypes = {
  taskId: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
};

export default CreateForm;
