import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, ButtonGroup, Modal, Label,
} from '@adnz/ui';

import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import TextAreaField from 'src/components/TextareaV2Field';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import { ICONS } from 'src/constants';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelectV2Field, { getValue } from 'src/components/ReactSelectV2Field';
import { formDecorator } from 'src/components/FieldDecorator';
import CheckboxField from 'src/components/form/fields/CheckboxField';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const validate = (values) => {
  const errors = {};
  if (!values.get('accountId')) {
    errors.accountId = i18n.t('serviceDashboard:ACCOUNT_REQUIRED');
  }
  if (!values.get('leadSource')) {
    errors.leadSource = i18n.t('serviceDashboard:SOURCE_REQUIRED');
  }
  if (!values.get('priority')) {
    errors.priority = i18n.t('serviceDashboard:PRIORITY_REQUIRED');
  }
  return errors;
};

const CreateComponent = ({
  closeEditForm,
  handleSubmit,
  error,
  submitting,
  isEdit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  const updatePriority = React.useCallback(
    (evt, val) => {
      dispatch(actions.updatePriority(val, 'account-tasks-create'));
    },
    [dispatch],
  );
  const { execute: loadAgencyAccounts } = useEffectWithToken(
    (token, filter) => actions.getLabelValueAgencyAccounts({ filter }, token),
    [],
  );
  const { execute: loadBrokerAccounts } = useEffectWithToken(
    (token, filter) => actions.getLabelValueBrokerAccounts({ filter }, token),
    [],
  );
  const { execute: loadTags } = useEffectWithToken(
    (token, filter) => actions.getLabelValueTags({ filter }, token),
    [],
  );
  const { execute: loadSalesPersons } = useEffectWithToken(
    (token, filter) => actions.getLabelValueSalesPersons({ filter }, token),
    [],
  );
  const { execute: loadTaskTopics } = useEffectWithToken(
    (token, filter) => actions.getLabelValueTaskTopics({ filter }, token),
    [],
  );
  const { execute: loadSources } = useEffectWithToken(
    (token, filter) => actions.getLabelValueSources({ filter }, token),
    [],
  );
  return (
    <>
      {error && <Alert type="error" message={error} />}
      <form autoComplete="false" onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6} data-testid="default-agency-field">
              <Field
                name="agencyAccountId"
                component={ReactSelectV2Field}
                defaultOptions
                isClearable
                loadOptions={loadAgencyAccounts}
                renderLayout={formDecorator(t('serviceDashboard:DEFAULT_AGENCY_ACCOUNT'))}
              />
            </Col>
            <Col md={6} data-testid="default-broker-field">
              <Field
                name="brokerAccountId"
                component={ReactSelectV2Field}
                defaultOptions
                isClearable
                loadOptions={loadBrokerAccounts}
                renderLayout={formDecorator(t('serviceDashboard:DEFAULT_BROKER_ACCOUNT'))}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} data-testid="lead-source-field">
              <Field
                name="leadSource"
                component={ReactSelectV2Field}
                loadOptions={loadSources}
                defaultOptions
                onChange={updatePriority}
                renderLayout={formDecorator(t('serviceDashboard:LEAD_SOURCE'), {
                  requiredLabel: true,
                })}
              />
            </Col>
            <Col md={6} data-testid="priority-field">
              <Field
                name="priority"
                component={ReactSelectV2Field}
                renderLayout={formDecorator(t('serviceDashboard:PRIORITY'), {
                  requiredLabel: true,
                })}
                options={[
                  { value: 'LOW', label: t('serviceDashboard:LOW') },
                  { value: 'MEDIUM', label: t('serviceDashboard:MEDIUM') },
                  { value: 'HIGH', label: t('serviceDashboard:HIGH') },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} data-testid="select-assignee-field">
              <Field
                name="assignee"
                component={ReactSelectV2Field}
                defaultOptions
                isClearable
                loadOptions={loadSalesPersons}
                renderLayout={formDecorator(t('serviceDashboard:SELECT_ASSIGNEE'))}
              />
            </Col>
            <Col md={6} data-testid="rocket-checkbox-field">
              <Label
                type="inline-checkbox-inform"
              >
                <Field
                  name="isImportant"
                  type="checkbox"
                  component={CheckboxField}
                  square
                />
                <span>{String.fromCodePoint(ICONS.ROCKET)}</span>
              </Label>
            </Col>
          </Row>
          <Row>
            <Col md={6} data-testid="topic-task-details-editing">
              <Field
                name="taskTopic"
                component={ReactSelectV2Field}
                isClearable
                loadOptions={loadTaskTopics}
                defaultOptions
                renderLayout={formDecorator(t('serviceDashboard:TASK_TOPIC'))}
              />
            </Col>
          </Row>
          <Field
            name="tags"
            component={ReactSelectV2Field}
            loadOptions={loadTags}
            isMulti
            defaultOptions
            renderLayout={formDecorator(t('serviceDashboard:LABELS'), {
              requiredLabel: false,
            })}
          />
          {!isEdit
            && (
            <Field
              name="message"
              component={TextAreaField}
              type="text"
              renderLayout={formDecorator(t('serviceDashboard:COMMENT'))}
            />
            )}
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            {!isEdit
              && (
              <Button
                theme="create-secondary"
                disabled={submitting}
                onClick={closeModal}
                data-testid="cancel-button"
              >
                <span>{t('serviceDashboard:CANCEL')}</span>
              </Button>
              )}
            {isEdit
              && (
              <Button
                theme="create-secondary"
                disabled={submitting}
                onClick={closeEditForm}
                data-testid="cancel-button"
              >
                <span>{t('serviceDashboard:CANCEL')}</span>
              </Button>
              )}
            <Button
              type="submit"
              disabled={submitting}
              isLoading={submitting}
            >
              <span>{t('serviceDashboard:SAVE')}</span>
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </form>
    </>
  );
};

CreateComponent.propTypes = {
  closeEditForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

CreateComponent.defaultProps = {
  error: undefined,
};

const CreateForm = reduxForm({
  form: 'account-tasks-create',
  enableReinitialize: true,
  validate,
})(CreateComponent);

const Create = ({ accountId, closeEditForm, isEdit }) => {
  const initialValues = useSelector((state) => selectors.getCreateTaskInitialValues(state, { itemId: accountId }));
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => {
      const formData = {
        account: data.get('accountId') ? { id: data.get('accountId').value } : null,
        assignee: data.get('assignee') ? { id: data.get('assignee').value } : null,
        leadSource: data.get('leadSource') ? { id: data.get('leadSource').value.id } : null,
        taskTopic: data.get('taskTopic') ? { id: data.get('taskTopic').value } : null,
        agencyAccount: data.get('agencyAccountId') ? { id: data.get('agencyAccountId').value } : null,
        brokerAccount: data.get('brokerAccountId') ? { id: data.get('brokerAccountId').value } : null,
        priority: getValue(data.get('priority')),
        activity: { message: data.get('message') },
        tags: data.get('tags') ? data.get('tags').map((tag) => ({
          id: Number.isNaN(+tag.value) ? null : tag.value,
          name: tag.label,
        })) : [],
        isImportant: data.get('isImportant'),
      };
      return dispatch(actions.createTask(formData));
    },
    [dispatch],
  );
  return (
    <CreateForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      closeEditForm={closeEditForm}
      isEdit={isEdit}
    />
  );
};

Create.propTypes = {
  accountId: PropTypes.string.isRequired,
  closeEditForm: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default Create;
