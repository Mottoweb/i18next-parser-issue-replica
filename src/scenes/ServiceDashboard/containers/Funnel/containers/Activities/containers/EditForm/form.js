import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { change } from 'redux-form';
import i18n from 'src/i18n';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import { DATE_TIME_FORMAT_V3 } from 'src/constants';
import { TIME_ISO } from '@adnz/api-helpers';
import { Alert, Button, ButtonGroup } from '@adnz/ui';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { useRequest } from '@adnz/use-request';
import ReactSelectField, { getValue } from 'src/components/ReactSelectV2Field';
import TextareaField from 'src/components/TextareaV2Field';
import TextField from 'src/components/TextV2Field';
import DatePickerField from 'src/components/DatePickerV2Field';
import FieldDecorator, { formDecorator } from 'src/components/FieldDecorator';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import LoaderComponent from 'src/components/Loader';
import ErrorComponent from 'src/components/Error';
import { getLabelValueTags } from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/actions';
import { getTagsByIds } from '@adnz/api-ws-funnel';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

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
  activityId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const hasNoTask = useSelector((state) => !selectors.getActivityTaskId(state, { itemId: activityId }));
  const contactAccountId = useSelector(
    (state) => selectors.getSelectedAccountIdForContacts(state, { instance: 'edit-activity' }),
  );
  const tagsIds = useSelector((state) => selectors.getTagsIds(state, { itemId: activityId }));
  const contactTypeOptions = useSelector(selectors.getContactTypes);
  const types = useSelector(selectors.getLabelValueTypes);
  const optionsContacts = useSelector((state) => selectors.getCurrentContacts(state, { contactAccountId }));
  const { execute: loadAccounts } = useEffectWithToken(
    (token, prefix) => actions.getLabelValueAccounts({ prefix }, token),
    [],
  );
  const dispatch = useDispatch();
  const closeEditForm = React.useCallback(
    () => dispatch(actions.closeActivityEditForm()),
    [dispatch],
  );
  const { execute: handleAccountChange } = useEffectWithToken(
    (token, v) => {
      Promise.all([
        dispatch(change('edit-activity', 'contactId', null)),
        dispatch(actions.getDetailedAccount(token, getValue(v))),
      ]);
    },
    [],
  );
  const { execute: loadContacts } = useEffectWithToken(
    (token) => dispatch(actions.getValueContactByAccountId(contactAccountId, token)),
    [contactAccountId],
  );
  const { execute: loadTags } = useEffectWithToken(
    (token, filter) => getLabelValueTags({ filter }, token),
    [],
  );
  useRequest({
    apiMethod: getTagsByIds,
    defaultData: { items: [] },
    runOnMount: true,
    parameters: [tagsIds],
    onSuccess: ({ items }) => {
      const tags = items.map((tag) => ({ label: tag.name, value: tag.id }));
      dispatch(change('edit-activity', 'tags', tags));
    },
  });
  React.useEffect(
    () => {
      loadContacts();
    },
    [loadContacts],
  );

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col md={4}>
          <Field
            id="select-type-edit"
            name="activityType"
            component={ReactSelectField}
            options={types}
            cache={false}
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_TYPE'))} requiredLabel {...p} />}
          />
        </Col>
        <Col md={4}>
          <Field
            id="select-account-edit"
            name="entityId"
            component={ReactSelectField}
            defaultOptions
            loadOptions={loadAccounts}
            cache={false}
            isDisabled={!hasNoTask}
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_ACCOUNT'))} {...p} />}
            onChange={handleAccountChange}
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
      </Row>
      <Row>
        <Col md={4}>
          <Field
            id="select-account-type-edit"
            name="contactType"
            component={ReactSelectField}
            isClearable
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_ACCOUNT_TYPE'))} {...p} />}
            options={contactTypeOptions}
          />
        </Col>
        <Col md={4}>
          <Field
            id="select-contact-edit"
            key={contactAccountId}
            name="contactId"
            component={ReactSelectField}
            isClearable
            options={optionsContacts}
            renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:SELECT_CONTACT'))} {...p} />}
          />
        </Col>
        <Col md={4} data-testid="activities-date-field">
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
        <Col md={4}>
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
          id="close-edit-button"
          theme="create-secondary"
          onClick={closeEditForm}
        >
          {t('serviceDashboard:BUTTON_CLOSE')}
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          isLoading={submitting}
        >
          {t('serviceDashboard:BUTTON_UPDATE_COMMENT')}
        </Button>
      </ButtonGroup>
    </form>
  );
};

EditComponent.propTypes = {
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  activityId: PropTypes.string.isRequired,
};

EditComponent.defaultProps = {
  error: undefined,
};

const EditForm = reduxForm({
  form: 'edit-activity',
  enableReinitialize: true,
  validate,
})(EditComponent);

const Edit = ({ activityId, initialValues, onSubmit }) => {
  const accountId = useSelector((state) => selectors.getActivityAccountId(state, { itemId: activityId }));
  const dispatch = useDispatch();
  const { loading, error } = useEffectWithToken(
    (token) => dispatch(actions.getDetailedAccount(token, accountId)),
    [activityId],
    true,
  );
  if (loading) {
    return <LoaderComponent />;
  }
  if (error) {
    return <ErrorComponent title={error.message} />;
  }
  return (
    <EditForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      activityId={activityId}
    />
  );
};

Edit.propTypes = {
  activityId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Edit;
