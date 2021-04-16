import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getValue } from 'src/components/ReactSelectV2Field';
import { toDateTimeUnixType } from '@adnz/api-helpers';
import { DATE_TIME_FORMAT } from 'src/constants';
import { Section } from '@adnz/ui';
import Form from './form';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const EditForm = ({
  activityId,
}) => {
  const initialValues = useSelector((state) => selectors.getActivityInitialValues(state, { itemId: activityId }));
  const dispatch = useDispatch();
  const updateActivity = React.useCallback(
    (data) => dispatch(actions.editActivity(activityId,
      {
        id: data.get('id'),
        entityId: getValue(data.get('entityId')),
        message: data.get('message'),
        contact: data.get('contactId') ? { id: getValue(data.get('contactId')) } : null,
        title: data.get('title'),
        date: toDateTimeUnixType(moment(data.get('date'), DATE_TIME_FORMAT)),
        activityType: getValue(data.get('activityType')),
        entityType: 'ACCOUNT',
        tags: data.get('tags') ? data.get('tags').map((tag) => ({
          id: Number.isNaN(+tag.value) ? null : tag.value,
          name: tag.label,
        })) : [],
      })),
    [dispatch, activityId],
  );
  return (
    <Section isForm>
      <Form key={activityId} activityId={activityId} initialValues={initialValues} onSubmit={updateActivity} />
    </Section>
  );
};

EditForm.propTypes = {
  activityId: PropTypes.string.isRequired,
};

export default EditForm;
