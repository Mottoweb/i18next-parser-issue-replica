import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, ButtonGroup, Modal,
} from '@adnz/ui';

import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import TextField from 'src/components/TextV2Field';
import TextareaField from 'src/components/TextareaV2Field';
import { formDecorator } from 'src/components/FieldDecorator';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const validate = (values) => {
  const errors = {};
  if (!values.get('title')) {
    errors.title = i18n.t('serviceDashboard:TITLE_REQUIRED');
  }
  return errors;
};

const Component = ({
  handleSubmit,
  error,
  submitting,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <>
      {error && <Alert type="error" message={error} />}
      <form autoComplete="false" onSubmit={handleSubmit}>
        <Modal.Body>
          <Field
            name="title"
            type="text"
            component={TextField}
            renderLayout={formDecorator(t('serviceDashboard:TITLE'), {
              requiredLabel: true,
            })}
          />
          <Field
            name="description"
            type="text"
            component={TextareaField}
            renderLayout={formDecorator(t('serviceDashboard:DESCRIPTION'))}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              type="submit"
              isLoading={submitting}
              disabled={submitting}

            >
              {t('serviceDashboard:SAVE')}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </form>
    </>
  );
};

Component.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

Component.defaultProps = {
  error: undefined,
};

const ComponentForm = reduxForm({
  form: 'topic-form',
  enableReinitialize: true,
  validate,
})(Component);

const MeetingForm = ({ itemId }) => {
  const initialValues = useSelector(selectors.getInitialValues);
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => (itemId
      ? dispatch(actions.update(itemId, data.toJS()))
      : dispatch(actions.create(data.toJS()))),
    [dispatch, itemId],
  );
  return (
    <ComponentForm
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
};

MeetingForm.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default MeetingForm;
