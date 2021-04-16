import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import { DATE_TIME_FORMAT_V3 } from 'src/constants';
import { TIME_ISO } from '@adnz/api-helpers';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelectField from 'src/components/ReactSelectV2Field';
import TextareaField from 'src/components/TextareaV2Field';
import TextField from 'src/components/TextV2Field';
import DatePickerField from 'src/components/DatePickerV2Field';
import FieldDecorator, { formDecorator } from 'src/components/FieldDecorator';
import CheckboxSlideField from 'src/components/CheckboxSlideField';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import { Button } from '@adnz/ui';
import * as selectors from '../selectors';
import * as actions from '../actions';

const types = [
  { value: 'COMMENT', label: i18n.t('serviceDashboard:COMMENT') },
  { value: 'EMAIL', label: i18n.t('serviceDashboard:EMAIL') },
  { value: 'PHONE', label: i18n.t('serviceDashboard:PHONE') },
  { value: 'MEETING', label: i18n.t('serviceDashboard:MEETING') },
];

const validate = (values, props) => {
  const errors = {};
  if (!values.get('activityType')) {
    errors.activityType = i18n.t('serviceDashboard:TOUCHPOINT_TYPE_IS_REQUIRED');
  }
  if (!values.get('message')) {
    errors.message = i18n.t('serviceDashboard:DESCRIPTION_IS_REQUIRED');
  }
  if (values.get('topics') === undefined || values.get('topics').length === 0) {
    errors.topics = i18n.t('serviceDashboard:TOPIC_DISCUSSION_IS_MISSING');
  }
  if (!!props.isMeeting && !values.get('title')) {
    errors.title = i18n.t('serviceDashboard:TITLE_REQUIRED');
  }

  return errors;
};

const CreateComponent = ({
  handleSubmit,
  submitting,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const onContactTypeSelect = React.useCallback(
    (evt, val) => {
      dispatch(actions.onContactTypeSelect(val));
    },
    [dispatch],
  );
  const contactTypeOptions = useSelector(selectors.getContactTypes);
  const contactOptions = useSelector(selectors.getContactOptions);
  const activeContactType = useSelector(selectors.getActiveContactType);
  const isMeeting = useSelector(selectors.getIsMeeting);
  useEffectWithToken(
    (token) => {
      dispatch(actions.getTopicOptions(token));
    },
    [],
    true,
  );
  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col md={4}>
          <Field
            id="select-type-create-task"
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
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:TITLE'))} requiredLabel={!!isMeeting} {...p} />}
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
            id="select-account-type-create-task"
            name="contactType"
            component={ReactSelectField}
            isClearable
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_ACCOUNT_TYPE'))} {...p} />}
            options={contactTypeOptions}
            onChange={onContactTypeSelect}
          />
        </Col>
        <Col md={4}>
          <Field
            id="select-contact-create-task"
            key={activeContactType}
            name="contactId"
            component={ReactSelectField}
            isClearable
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_CONTACT'))} {...p} />}
            options={contactOptions}
          />
        </Col>
      </Row>
      <Field
        name="message"
        type="text"
        component={TextareaField}
        renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:TOUCHPOINT_DESCRIPTION'))} requiredLabel {...p} />}
      />
      <div className="flex-container flex-container_ai-c flex-container_wrap flex-container_j-sb">
        <Row>
          <Field
            name="notifySales"
            type="checkbox"
            component={CheckboxSlideField}
            label={t('serviceDashboard:NOTIFY_SALES')}
            renderLayout={formDecorator('', {
              inlineField: true,
            })}
          />
        </Row>
        <Button
          type="submit"
          disabled={submitting}
          isLoading={submitting}
        >
          {t('serviceDashboard:BUTTON_CREATE_COMMENT')}
        </Button>
      </div>
    </form>
  );
};

CreateComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const CreateForm = reduxForm({
  form: 'create-activity',
  enableReinitialize: true,
  validate,
})(CreateComponent);

export default CreateForm;
