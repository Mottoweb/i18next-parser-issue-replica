import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
} from 'immutable';
import {
  setInitValuesDateTime,
} from 'src/helpers';
import { getValue } from 'src/components/ReactSelectV2Field';
import PropTypes from 'prop-types';
import Form from './form';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const CreateForm = ({ closeModal }) => {
  const initialValues = useSelector(selectors.getActivityCreateFormInitialValues);
  const dispatch = useDispatch();
  const createActivity = React.useCallback(
    (data) => {
      const form = {
        message: data.get('message'),
        entityId: getValue(data.get('entityId')),
        accountId: getValue(data.get('entityId')),
        activityType: getValue(data.get('activityType')),
        topicDiscussions: data.get('topics') ? data.get('topics').map((i) => i.value) : new List(),
        entityType: data.get('entityType'),
        contact: data.get('contactId') ? { id: getValue(data.get('contactId')) } : null,
        title: data.get('title'),
        date: data.get('date'),
        tags: data.get('tags', List()).map((tag) => ({
          id: Number.isNaN(+tag.value) ? null : tag.value,
          name: tag.label,
        })),
      };
      const isMeeting = form.activityType === 'MEETING';
      return dispatch(isMeeting ? actions.createMeeting(form) : actions.createActivity(form));
    },
    [dispatch],
  );
  return (
    <Form
      initialValues={setInitValuesDateTime(initialValues, 'date')}
      onSubmit={createActivity}
      closeModal={closeModal}
    />
  );
};

CreateForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreateForm;
