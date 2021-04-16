import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, ButtonGroup, Modal,
} from '@adnz/ui';

import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelectField, { getValue } from 'src/components/ReactSelectV2Field';
import TextAreaField from 'src/components/TextareaV2Field';
import FieldDecorator from 'src/components/FieldDecorator';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as actions from '../../actions';
import * as taskActions from '../../../Tasks/actions';
import * as selectors from '../../selectors';

const validate = (values) => {
  const errors = {};
  if (!values.get('accountIds')) {
    errors.accountIds = i18n.t('serviceDashboard:ACCOUNT_REQUIRED');
  }
  if (!values.get('priority')) {
    errors.priority = i18n.t('serviceDashboard:PRIORITY_REQUIRED');
  }
  return errors;
};

const BatchCreateComponent = ({
  handleSubmit,
  error,
  submitting,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { execute: loadAccounts } = useEffectWithToken(
    (token, filter) => taskActions.getLabelValueAccounts({ filter }, token),
    [],
  );
  const { execute: loadTags } = useEffectWithToken(
    (token, filter) => taskActions.getLabelValueTags({ filter }, token),
    [],
  );
  const dispatch = useDispatch();
  const closeBatchForm = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  return (
    <>
      <form autoComplete="false" onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert type="error" message={error} />}
          <Row>
            <Col md={6}>
              <Field
                id="accounts-field-dropdown"
                name="accountIds"
                component={ReactSelectField}
                loadOptions={loadAccounts}
                isMulti
                isClearable
                defaultOptions
                renderLayout={(props) => (
                  <FieldDecorator
                    size={12}
                    labelSize={12}
                    label={t('serviceDashboard:ACCOUNTS')}
                    {...props}
                  />
                )}
              />
            </Col>
            <Col md={6}>
              <Field
                id="priority-field-dropdown"
                name="priority"
                component={ReactSelectField}
                size={12}
                renderLayout={(props) => <FieldDecorator {...props} label={t('serviceDashboard:PRIORITY')} size={12} labelSize={12} />}
                options={[
                  { value: 'LOW', label: t('serviceDashboard:LOW') },
                  { value: 'MEDIUM', label: t('serviceDashboard:MEDIUM') },
                  { value: 'HIGH', label: t('serviceDashboard:HIGH') },
                ]}
              />
            </Col>
          </Row>
          <Field
            name="message"
            component={TextAreaField}
            type="text"
            renderLayout={(props) => <FieldDecorator {...props} label={t('serviceDashboard:COMMENT')} size={12} labelSize={12} />}
          />
          <Row>
            <Col md={6}>
              <Field
                id="labels-field-dropdown"
                name="tags"
                component={ReactSelectField}
                isMulti
                isClearable
                defaultOptions
                loadOptions={loadTags}
                renderLayout={(props) => <FieldDecorator {...props} label={t('serviceDashboard:LABELS')} size={12} labelSize={12} />}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              type="button"
              theme="create-secondary"
              disabled={submitting}
              onClick={closeBatchForm}
            >
              <span>{t('serviceDashboard:CANCEL')}</span>
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              disabled={submitting}
            >
              <span>{t('serviceDashboard:SAVE')}</span>
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </form>
    </>
  );
};

BatchCreateComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

BatchCreateComponent.defaultProps = {
  error: undefined,
};

const BatchCreateForm = reduxForm({
  form: 'tasks-batch-create-form',
  enableReinitialize: true,
  validate,
})(BatchCreateComponent);

const BatchCreate = ({ itemId }) => {
  const initialValues = useSelector(selectors.getBatchInitialValues);
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => {
      const formData = {
        accountIds: data.get('accountIds').map((id) => getValue(id)),
        task: {
          leadSource: { id: itemId },
          priority: getValue(data.get('priority')),
          activities: [{ comment: data.get('message') || '' }],
          tags: data.get('tags').filter((tag) => !!tag).map((tag) => ({
            id: +tag.value,
            name: tag.label,
          })),
        },
      };
      return dispatch(actions.createTaskBatch(formData));
    },
    [dispatch, itemId],
  );
  return (
    <BatchCreateForm
      onSubmit={onSubmit}
      initialValues={initialValues}
    />
  );
};

BatchCreate.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default BatchCreate;
