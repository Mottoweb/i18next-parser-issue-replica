import React from 'react';
import { Map } from 'immutable';
import { useRequest } from '@adnz/use-request';
import { useTranslation } from 'react-i18next';
import { getTags, TagType, TaskDto } from '@adnz/api-ws-funnel';
import { useDispatch, useSelector } from 'react-redux';
import { FormErrors, InjectedFormProps } from 'redux-form';
import {
  Alert,
  Modal,
  Button,
  ButtonGroup,
  Label,
} from '@adnz/ui';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';

import i18n from 'src/i18n';
import CheckboxField from 'src/components/form/fields/CheckboxField';
import TextAreaField from 'src/components/TextareaV2Field';
import ReactSelectV2Field from 'src/components/ReactSelectV2Field';
import { ICONS } from 'src/constants';
import { Option } from 'src/types';
import { formDecorator } from 'src/components/FieldDecorator';
import useEffectWithToken from 'src/hooks/useEffectWithToken';

import * as actions from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/actions';
import * as selectors from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/selectors';
import { TaskForm } from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/types';

interface Errors extends TaskDto {
  accountId?: string
}

const validate = (values: Map<string, string>): FormErrors<Errors> => {
  const errors: FormErrors<Errors> = {};
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

export interface ICreateComponent {
  isEdit: boolean
  closeModal: () => void
}

const CreateComponent: React.FC<ICreateComponent & InjectedFormProps<Map<string, string>, ICreateComponent>> = ({
  closeModal,
  handleSubmit,
  error,
  submitting,
  isEdit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { execute: loadAccounts } = useEffectWithToken(
    (token, filter) => actions.getLabelValueAccounts({ filter }, token),
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

  const [,, loadTags] = useRequest({
    apiMethod: getTags,
    runOnMount: false,
  });

  const handleLoadTags = React.useCallback(
    async (nameFilter): Promise<Option<string>[]> => {
      const { items } = await loadTags({
        page: 0,
        sort: 'name',
        type: TagType.SALESFUNNEL,
        limit: 100,
        order: 'asc',
        nameFilter,
      });

      return items.map((item) => ({
        value: item.id ?? '',
        label: t(item.name),
      }));
    },
    [t, loadTags],
  );

  const { execute: loadSalesPersons } = useEffectWithToken(
    (token, filter) => actions.getLabelValueSalesPersons({ filter }, token),
    [],
  );
  const dispatch = useDispatch();
  const closeEditForm = React.useCallback(
    () => dispatch(actions.hideTaskEditForm()),
    [dispatch],
  );
  const updatePriority = React.useCallback(
    (evt, val) => {
      dispatch(actions.updatePriority(val, 'tasks-create-form'));
    },
    [dispatch],
  );
  const updateAccountDefaults = React.useCallback(
    (evt, val) => {
      dispatch(actions.updateAccountDefaults(val, 'tasks-create-form'));
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
  return (
    <>
      {error && <Alert type="error" message={error} />}
      <form autoComplete="false" onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6} data-testid="select-account">
              <Field
                name="accountId"
                // @ts-expect-error: the problem in onChange function
                component={ReactSelectV2Field}
                loadOptions={loadAccounts}
                defaultOptions
                onChange={updateAccountDefaults}
                renderLayout={formDecorator(t('serviceDashboard:ACCOUNT'), {
                  requiredLabel: true,
                })}
              />
            </Col>
            <Col md={6} data-testid="select-agency-account">
              <Field
                name="agencyAccountId"
                component={ReactSelectV2Field}
                defaultOptions
                isClearable
                loadOptions={loadAgencyAccounts}
                renderLayout={formDecorator(t('serviceDashboard:DEFAULT_AGENCY_ACCOUNT'))}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} data-testid="select-broker-account">
              <Field
                name="brokerAccountId"
                component={ReactSelectV2Field}
                defaultOptions
                isClearable
                loadOptions={loadBrokerAccounts}
                renderLayout={formDecorator(t('serviceDashboard:DEFAULT_BROKER_ACCOUNT'))}
              />
            </Col>
            <Col md={6} data-testid="select-lead-source">
              <Field
                name="leadSource"
                // @ts-expect-error: the problem in onChange function
                component={ReactSelectV2Field}
                loadOptions={loadSources}
                defaultOptions
                onChange={updatePriority}
                renderLayout={formDecorator(t('serviceDashboard:LEAD_SOURCE'), {
                  requiredLabel: true,
                })}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} data-testid="priority-field">
              <Field
                id="select-priority"
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
            <Col md={6} data-testid="rocket-important-checkbox">
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
            <Col md={6}>
              <Field
                id="select-assignee"
                name="assignee"
                component={ReactSelectV2Field}
                defaultOptions
                isClearable
                loadOptions={loadSalesPersons}
                renderLayout={formDecorator(t('serviceDashboard:SELECT_ASSIGNEE'))}
              />
            </Col>
          </Row>
          <Field
            id="select-labels"
            name="tags"
            component={ReactSelectV2Field}
            loadOptions={handleLoadTags}
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
                data-testid="cancel-button"
                theme="create-secondary"
                disabled={submitting}
                onClick={closeModal}
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
              >
                <span>{t('serviceDashboard:CANCEL')}</span>
              </Button>
              )}
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

const CreateForm = reduxForm<Map<string, string>, ICreateComponent>({
  form: 'tasks-create-form',
  enableReinitialize: true,
  validate,
})(CreateComponent);

export interface ICreate {
  isEdit: boolean
  closeModal: () => void
}

const Create: React.FC<ICreate> = ({ isEdit, closeModal }) => {
  const initialValues = useSelector(selectors.getCreateInitialValues);
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => {
      const formData: TaskForm = {
        account: data.get('accountId') ? { id: data.get('accountId').value } : undefined,
        assignee: data.get('assignee') ? { id: data.get('assignee').value } : undefined,
        leadSource: data.get('leadSource') ? { id: data.get('leadSource').value } : undefined,
        taskTopic: data.get('taskTopic') ? { id: data.get('taskTopic').value } : undefined,
        agencyAccount: data.get('agencyAccountId') ? { id: data.get('agencyAccountId').value } : undefined,
        brokerAccount: data.get('brokerAccountId') ? { id: data.get('brokerAccountId').value } : undefined,
        priority: data.get('priority').value,
        activity: { message: data.get('message') },
        tags: data.get('tags') ? data.get('tags').map((tag: Option<string>) => ({
          id: Number.isNaN(+tag.value) ? null : tag.value,
          name: tag.label,
        })) : [],
        isImportant: data.get('isImportant'),
      };
      return dispatch(actions.create(formData));
    },
    [dispatch],
  );
  return (
    <CreateForm
      isEdit={isEdit}
      closeModal={closeModal}
      onSubmit={onSubmit}
      initialValues={initialValues}
    />
  );
};

export default Create;
