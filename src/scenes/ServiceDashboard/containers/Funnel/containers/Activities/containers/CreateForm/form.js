import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import {
  Field,
  reduxForm,
  formValueSelector,
} from 'redux-form/immutable';
import { change } from 'redux-form';
import { DATE_TIME_FORMAT_V3 } from 'src/constants';
import { TIME_ISO } from '@adnz/api-helpers';
import {
  Alert, Button, ButtonGroup, Modal,
} from '@adnz/ui';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelectField, { getValue } from 'src/components/ReactSelectV2Field';
import TextareaField from 'src/components/TextareaV2Field';
import TextField from 'src/components/TextV2Field';
import DatePickerField from 'src/components/DatePickerV2Field';
import FieldDecorator, { formDecorator } from 'src/components/FieldDecorator';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import { getLabelValueTags } from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/actions';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const types = [
  { value: 'COMMENT', label: i18n.t('serviceDashboard:COMMENT') },
  { value: 'EMAIL', label: i18n.t('serviceDashboard:EMAIL') },
  { value: 'PHONE', label: i18n.t('serviceDashboard:PHONE') },
  { value: 'MEETING', label: i18n.t('serviceDashboard:MEETING') },
];

const validate = (values) => {
  const errors = {};
  if (!values.get('activityType')) {
    errors.activityType = i18n.t('serviceDashboard:TOUCHPOINT_TYPE_IS_REQUIRED');
  }
  if (!values.get('entityId')) {
    errors.entityId = i18n.t('serviceDashboard:ACCOUNT_REQUIRED');
  }
  if (!values.get('message')) {
    errors.message = i18n.t('serviceDashboard:DESCRIPTION_IS_REQUIRED');
  }
  return errors;
};

const CreateComponent = ({
  error,
  handleSubmit,
  submitting,
  contactAccountId,
  closeModal,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const entityId = useSelector((state) => formValueSelector('create-touchpoint')(state, 'entityId'));
  useEffectWithToken(
    (token) => {
      if (entityId) {
        dispatch(change('create-touchpoint', 'contactId', null));
        dispatch(actions.getDetailedAccount(token, getValue(entityId)));
      }
    },
    [entityId],
    true,
  );
  const { execute: loadTags } = useEffectWithToken(
    (token, filter) => getLabelValueTags({ filter }, token),
    [],
  );
  const contactTypeOptions = useSelector(selectors.getContactTypes);
  const isMeeting = useSelector((state) => selectors.getIsMeeting(state, { instance: 'create-touchpoint' }));
  const optionsContacts = useSelector(selectors.getCurrentContacts);
  const { execute: loadAccounts } = useEffectWithToken(
    (token, prefix) => actions.getLabelValueAccounts({ prefix }, token),
    [],
  );
  return (
    <form onSubmit={handleSubmit}>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Field
              id="select-type"
              name="activityType"
              component={ReactSelectField}
              options={types}
              cache={false}
              renderLayout={formDecorator(t('serviceDashboard:SELECT_TYPE'))}
            />
          </Col>
          <Col md={6}>
            <Field
              id="select-account"
              name="entityId"
              component={ReactSelectField}
              defaultOptions
              loadOptions={loadAccounts}
              cache={false}
              renderLayout={formDecorator(t('serviceDashboard:SELECT_ACCOUNT'))}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Field
              name="title"
              type="text"
              component={TextField}
              renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:TITLE'))} requiredLabel={!!isMeeting} {...p} />}
            />
          </Col>
          <Col md={6}>
            <Field
              id="select-account-type"
              name="contactType"
              component={ReactSelectField}
              isClearable
              renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_ACCOUNT_TYPE'))} {...p} />}
              options={contactTypeOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Field
              id="select-contact"
              key={contactAccountId}
              name="contactId"
              component={ReactSelectField}
              isClearable
              options={optionsContacts}
              renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_CONTACT'))} {...p} />}
            />
          </Col>
          <Col md={6}>
            <Field
              name="date"
              dateFormat={DATE_TIME_FORMAT_V3}
              timeFormat={TIME_ISO}
              showTimeSelect
              showLocal
              timeIntervals={15}
              component={DatePickerField}
              renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:DATE'))} wrapperClassName="datepicker-group" {...p} />}
            />
          </Col>
        </Row>
        <Field
          id="labels-task-details-editing"
          name="tags"
          component={ReactSelectField}
          isClearable
          defaultOptions
          isMulti
          loadOptions={loadTags}
          renderLayout={formDecorator(t('serviceDashboard:LABELS'))}
        />
        <Field
          name="message"
          type="text"
          component={TextareaField}
          renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:TOUCHPOINT_DESCRIPTION'))} requiredLabel {...p} />}
        />
        {error && <Alert type="error" message={error} />}
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button
            theme="create-secondary"
            onClick={closeModal}
            data-testid="cancel-button"
          >
            {t('serviceDashboard:CLOSE')}
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            isLoading={submitting}
            data-testid="create-comment-button"
          >
            {t('serviceDashboard:BUTTON_CREATE_COMMENT')}
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </form>
  );
};

CreateComponent.propTypes = {
  error: PropTypes.string,
  contactAccountId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

CreateComponent.defaultProps = {
  error: null,
};

const CreateForm = reduxForm({
  form: 'create-touchpoint',
  enableReinitialize: true,
  validate,
})(CreateComponent);

const Create = ({ initialValues, onSubmit, closeModal }) => {
  const contactAccountId = useSelector(
    (state) => selectors.getSelectedAccountIdForContacts(state, { instance: 'create-touchpoint' }),
  );
  const dispatch = useDispatch();
  useEffectWithToken(
    (token) => {
      dispatch(actions.getTopicOptions(token));
      if (contactAccountId) {
        dispatch(actions.getValueContactByAccountId(contactAccountId, token));
      }
    },
    [contactAccountId],
    true,
  );
  return (
    <CreateForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      contactAccountId={contactAccountId}
      closeModal={closeModal}
    />
  );
};

Create.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Create;
