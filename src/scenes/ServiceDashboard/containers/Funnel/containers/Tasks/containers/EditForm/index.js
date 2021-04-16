import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, ButtonGroup, PageHeader, Label, Section,
} from '@adnz/ui';
import {
  Container,
  Row,
  Col,
} from 'styled-bootstrap-grid';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelectV2Field from 'src/components/ReactSelectV2Field';
import CheckboxField from 'src/components/form/fields/CheckboxField';
import { ICONS } from 'src/constants';
import { formDecorator } from 'src/components/FieldDecorator';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import { handleTaskEditFormData } from './helpers';

const LabelWrap = styled(Label)`
  margin: 26px 0 15px 0;
`;

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

const FormComponent = ({
  handleSubmit,
  error,
  submitting,
  taskId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  useEffectWithToken(
    () => dispatch(actions.getAccountCampaigns(null, taskId)),
    [taskId],
    true,
  );
  const availableAccountCampaigns = useSelector(selectors.availableAccountCampaigns);
  const isTopicNotEditable = useSelector((state) => selectors.isTopicNotEditable(state, { itemId: taskId }));
  const { execute: loadAccounts } = useEffectWithToken(
    (token, filter) => actions.getLabelValueAccounts({ filter }, token),
    [],
  );
  const { execute: loadAssignees } = useEffectWithToken(
    (token, filter) => actions.getLabelValueAssignees({ filter }, token),
    [],
  );
  const { execute: loadTags } = useEffectWithToken(
    (token, filter) => actions.getLabelValueTags({ filter }, token),
    [],
  );
  const { execute: loadAgencyAccounts } = useEffectWithToken(
    (token, filter) => actions.getLabelValueAgencyAccounts({ filter }, token),
    [],
  );
  const { execute: loadBrokerAccounts } = useEffectWithToken(
    (token, filter) => actions.getLabelValueBrokerAccounts({ filter }, token),
    [],
  );
  const closeEditForm = React.useCallback(
    () => dispatch(actions.hideTaskEditForm()),
    [dispatch],
  );
  const updateAccountDefaults = React.useCallback(
    (evt, val) => {
      dispatch(actions.updateAccountDefaults(val, 'tasks-form'));
    },
    [dispatch],
  );
  const { execute: loadSources } = useEffectWithToken(
    (token, filter) => dispatch(actions.getLabelValueSources({ filter }, token)),
    [],
  );
  const { execute: loadTaskTopics } = useEffectWithToken(
    (token, filter) => dispatch(actions.getTaskTopics({ filter }, token)),
    [],
  );
  const updatePriority = React.useCallback(
    (evt, val) => {
      dispatch(actions.updatePriority(val, 'tasks-form'));
    },
    [dispatch],
  );
  return (
    <>
      <PageHeader title={t('serviceDashboard:TASK_DETAILS_EDITING')} />
      <Container>
        {error && <Alert type="error" message={error} />}
        <form className="forms-page" autoComplete="false" onSubmit={handleSubmit}>
          <Section>
            <Row>
              <Col md={4}>
                <Field
                  id="accounts-task-details-editing"
                  name="accountId"
                  component={ReactSelectV2Field}
                  isClearable
                  defaultOptions
                  loadOptions={loadAccounts}
                  onChange={updateAccountDefaults}
                  renderLayout={formDecorator(t('serviceDashboard:ACCOUNT'))}
                />
              </Col>
              <Col md={4}>
                <Field
                  id="agency-account-task-details-editing"
                  name="agencyAccountId"
                  component={ReactSelectV2Field}
                  isClearable
                  defaultOptions
                  loadOptions={loadAgencyAccounts}
                  renderLayout={formDecorator(t('serviceDashboard:DEFAULT_AGENCY_ACCOUNT'))}
                />
              </Col>
              <Col md={4}>
                <Field
                  id="broker-account-task-details-editing"
                  name="brokerAccountId"
                  component={ReactSelectV2Field}
                  isClearable
                  loadOptions={loadBrokerAccounts}
                  defaultOptions
                  renderLayout={formDecorator(t('serviceDashboard:DEFAULT_BROKER_ACCOUNT'))}
                />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Field
                  id="campagin-task-details-editing"
                  name="campaignId"
                  component={ReactSelectV2Field}
                  isClearable
                  options={availableAccountCampaigns}
                  defaultOptions
                  renderLayout={formDecorator(t('serviceDashboard:CAMPAIGN'))}
                />
              </Col>
              <Col md={4}>
                <Field
                  id="lead-source-task-details-editing"
                  name="leadSource"
                  component={ReactSelectV2Field}
                  isClearable
                  loadOptions={loadSources}
                  defaultOptions
                  renderLayout={formDecorator(t('serviceDashboard:LEAD_SOURCE'))}
                  onChange={updatePriority}
                />
              </Col>
              <Col md={4}>
                <Field
                  id="priority-task-details-editing"
                  name="priority"
                  component={ReactSelectV2Field}
                  isClearable
                  options={[
                    { label: t('serviceDashboard:LOW'), value: 'LOW' },
                    { label: t('serviceDashboard:MEDIUM'), value: 'MEDIUM' },
                    { label: t('serviceDashboard:HIGH'), value: 'HIGH' },
                  ]}
                  renderLayout={formDecorator(t('serviceDashboard:PRIORITY'), {
                    requiredLabel: true,
                  })}
                />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Field
                  id="labels-task-details-editing"
                  name="tags"
                  component={ReactSelectV2Field}
                  isClearable
                  defaultOptions
                  isMulti
                  loadOptions={loadTags}
                  renderLayout={formDecorator(t('serviceDashboard:LABELS'))}
                />
              </Col>
              <Col md={4}>
                <Field
                  id="assignee-task-details-editing"
                  name="assignee"
                  component={ReactSelectV2Field}
                  isClearable
                  defaultOptions
                  loadOptions={loadAssignees}
                  renderLayout={formDecorator(t('serviceDashboard:ASSIGNEE'))}
                />
              </Col>
              <Col md={4}>
                <Field
                  id="topic-task-details-editing"
                  name="taskTopic"
                  component={ReactSelectV2Field}
                  isClearable
                  loadOptions={loadTaskTopics}
                  defaultOptions
                  isDisabled={isTopicNotEditable}
                  renderLayout={formDecorator(t('serviceDashboard:TASK_TOPIC'))}
                />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <LabelWrap
                  type="inline-checkbox"
                >
                  <Field
                    name="isImportant"
                    type="checkbox"
                    component={CheckboxField}
                    square
                  />
                  <span>{String.fromCodePoint(ICONS.ROCKET)}</span>
                </LabelWrap>
              </Col>
            </Row>
          </Section>
          <ButtonGroup
            spacer="top"
            align="right"
            vertical
          >
            <Button
              size="big"
              type="submit"
              isLoading={submitting}
              disabled={submitting}
            >
              <span>{t('serviceDashboard:SAVE')}</span>
            </Button>
            <Button
              size="big"
              id="cancel-button-task-details-editing"
              onClick={closeEditForm}
              disabled={submitting}
              theme="create-secondary"
            >
              {t('serviceDashboard:CANCEL')}
            </Button>
          </ButtonGroup>
        </form>
      </Container>
    </>
  );
};

FormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  taskId: PropTypes.string.isRequired,
};

FormComponent.defaultProps = {
  error: undefined,
};

const FormForm = reduxForm({
  form: 'tasks-form',
  enableReinitialize: true,
  validate,
})(FormComponent);

const Form = ({ taskId }) => {
  const initialValues = useSelector((state) => selectors.getInitialValues(state, { itemId: taskId }));
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => dispatch(actions.update(taskId, handleTaskEditFormData(data))),
    [dispatch, taskId],
  );

  return (
    <FormForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      taskId={taskId}
    />
  );
};

Form.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default Form;
