import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import { Alert, Button, ButtonGroup } from '@adnz/ui';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { DATE_TIME_FORMAT_V3 } from 'src/constants';
import { TIME_ISO } from '@adnz/api-helpers';
import ReactSelectField from 'src/components/ReactSelectV2Field';
import TextareaField from 'src/components/TextareaV2Field';
import TextField from 'src/components/TextV2Field';
import DatePickerField from 'src/components/DatePickerV2Field';
import FieldDecorator from 'src/components/FieldDecorator';
import * as selectors from '../selectors';
import * as actions from '../actions';

const validate = (values) => {
  const errors = {};
  if (!values.get('activityType')) {
    errors.activityType = i18n.t('serviceDashboard:TOUCHPOINT_TYPE_IS_REQUIRED');
  }
  if (!values.get('message')) {
    errors.message = i18n.t('serviceDashboard:DESCRIPTION_IS_REQUIRED');
  }
  return errors;
};

const EditComponent = ({
  error,
  handleSubmit,
  submitting,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  const types = useSelector(selectors.getLabelValueTypes);
  const contactTypeOptions = useSelector(selectors.getContactTypes);
  const contactOptions = useSelector(selectors.getContactOptions);
  const activeContactType = useSelector(selectors.getActiveContactType);
  const dispatch = useDispatch();
  const closeEditForm = React.useCallback(
    () => dispatch(actions.closeActivityEditForm()),
    [dispatch],
  );
  const onContactTypeSelect = React.useCallback(
    (evt, val) => {
      dispatch(actions.onContactTypeSelect(val));
    },
    [dispatch],
  );
  return (
    <form onSubmit={handleSubmit} id="edit-form">
      <Row>
        <Col md={4}>
          <Field
            id="select-type-edit-task"
            name="activityType"
            component={ReactSelectField}
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_TYPE'))} requiredLabel {...p} />}
            isClearable
            options={types}
            cache={false}
          />
        </Col>
        <Col md={4}>
          <Field
            name="title"
            type="text"
            component={TextField}
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:TITLE'))} {...p} />}
          />
        </Col>
        <Col md={4}>
          <Field
            name="date"
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:DATE'))} wrapperClassName="datepicker-group" {...p} />}
            dateFormat={DATE_TIME_FORMAT_V3}
            timeFormat={TIME_ISO}
            showTimeSelect
            showLocal
            timeIntervals={15}
            component={DatePickerField}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Field
            id="select-account-type-edit-task"
            name="contactType"
            component={ReactSelectField}
            isClearable
            options={contactTypeOptions}
            onChange={onContactTypeSelect}
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_ACCOUNT_TYPE'))} {...p} />}
          />
        </Col>
        <Col md={4}>
          <Field
            id="select-contact-edit-task"
            key={activeContactType}
            name="contactId"
            component={ReactSelectField}
            isClearable
            options={contactOptions}
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_CONTACT'))} {...p} />}
          />
        </Col>
      </Row>
      <Field
        name="message"
        type="text"
        component={TextareaField}
        renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:TOUCHPOINT_DESCRIPTION'))} requiredLabel {...p} />}
      />
      {error && <Alert type="error" message={error} />}
      <ButtonGroup align="right">
        <Button
          type="button"
          theme="create-secondary"
          onClick={closeEditForm}
          data-testid="close-button-edit-task"
        >
          {t('serviceDashboard:BUTTON_CLOSE')}
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          isLoading={submitting}
          data-testid="update-activity-button"
        >
          {t('serviceDashboard:BUTTON_UPDATE_COMMENT')}
        </Button>
      </ButtonGroup>
    </form>
  );
};

EditComponent.propTypes = {
  error: PropTypes.string,
  closeEditForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  activeContactType: PropTypes.string.isRequired,
  onContactTypeSelect: PropTypes.func.isRequired,
};

EditComponent.defaultProps = {
  error: undefined,
};

const EditForm = reduxForm({
  enableReinitialize: true,
  validate,
})(EditComponent);

export default EditForm;
