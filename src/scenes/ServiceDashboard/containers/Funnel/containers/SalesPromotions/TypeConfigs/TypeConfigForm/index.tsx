import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import {
  Button, ButtonGroup, FormGroup, Label, Modal,
} from '@adnz/ui';
import { Form, Field } from 'react-final-form';
import notify from 'src/modules/Notification';
import { Col } from 'styled-bootstrap-grid';
import TextField from 'src/components/form/fields/TextField';
import Error from 'src/components/form/Error';
import {
  createSalesPromotionsTypeConfig,
  updateSalesPromotionTypeConfig,
} from '@adnz/api-ws-funnel';
import SwitchField from 'src/components/form/fields/SwitchField';
import arrayMutators from 'final-form-arrays';
import { useDispatch, useSelector } from '../../context';
import * as selectors from '../../selectors';
import validate, { TypeConfigFormValues } from './validate';
import * as actions from '../../actions';

import StatusFields from '../../StatusFields';

const TypeConfigForm: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const typeConfig = useSelector(selectors.getEditTypeConfig, []);
  const isOpened = useSelector(selectors.isTypeConfigModalOpened, []);
  const initialValues = useMemo(() => typeConfig ?? { active: true }, [typeConfig]);
  let handleResetForm: null | (() => void) = null;

  const [,, create] = useRequest({
    apiMethod: createSalesPromotionsTypeConfig,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (newItem) => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_TYPE_CONFIG_CREATED'));
        dispatch(actions.SAVE_TYPE_CONFIG(newItem));
        handleResetForm?.();
      },
      [handleResetForm, dispatch, t],
    ),
  });

  const [,, update] = useRequest({
    apiMethod: updateSalesPromotionTypeConfig,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (newItem) => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_TYPE_CONFIG_UPDATED'));
        dispatch(actions.SAVE_TYPE_CONFIG(newItem));
        handleResetForm?.();
      },
      [handleResetForm, dispatch, t],
    ),
  });

  const onSubmit = useCallback(
    (values: TypeConfigFormValues) => {
      if (typeConfig) {
        update(values, { typeConfigId: typeConfig.id });
      } else {
        create(values);
      }
    },
    [create, update, typeConfig],
  );

  const handleClose = useCallback(
    () => {
      dispatch(actions.CLOSE_MODAL());
      handleResetForm?.();
    },
    [dispatch, handleResetForm],
  );

  return (
    <Form<TypeConfigFormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        values,
        form,
      }) => {
        if (!handleResetForm && form && form.reset) {
          handleResetForm = form.reset;
        }
        return (
          <form onSubmit={handleSubmit}>
            <Modal
              isOpen={isOpened}
              onRequestClose={handleClose}
              title={t('serviceDashboard:TYPE_CONFIG')}
            >
              <Modal.Body>
                <FormGroup>
                  <Col md={6} data-testid="name-field">
                    <Label required>{t('serviceDashboard:NAME')}</Label>
                    <Field<string>
                      name="name"
                      render={(props) => (
                        <TextField {...props} />
                      )}
                    />
                    <Error name="name" />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col md={6} data-testid="status-field">
                    <Label>{t('serviceDashboard:STATE')}</Label>
                    <Label>
                      <Field<boolean> type="checkbox" name="active" render={(props) => <SwitchField {...props} />} />
                      <span css="margin-left: 10px;">{values.active ? t('serviceDashboard:ACTIVE') : t('serviceDashboard:INACTIVE')}</span>
                    </Label>
                    <Error name="active" />
                  </Col>
                </FormGroup>
                <StatusFields field="statuses" />
              </Modal.Body>
              <Modal.Footer>
                <ButtonGroup>
                  <Button
                    theme="create-secondary"
                    onClick={handleClose}
                    data-testid="cancel-button"
                  >
                    {t('serviceDashboard:CLOSE')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    isLoading={submitting}
                    onClick={handleSubmit}
                    data-testid="submit-button"
                  >
                    {t(typeConfig ? 'EDIT_CONFIG' : 'SAVE_CONFIG')}
                  </Button>
                </ButtonGroup>
              </Modal.Footer>
            </Modal>
          </form>
        );
      }}
    />
  );
};

export default TypeConfigForm;
