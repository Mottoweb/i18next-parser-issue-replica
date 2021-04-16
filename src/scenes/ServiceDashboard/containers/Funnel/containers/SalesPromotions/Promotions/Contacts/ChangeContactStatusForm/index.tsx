import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import {
  Button, ButtonGroup, FormGroup, Label, Modal,
} from '@adnz/ui';
import { Form, Field } from 'react-final-form';
import notify from 'src/modules/Notification';
import { Col } from 'styled-bootstrap-grid';
import Error from 'src/components/form/Error';
import SelectField from 'src/components/form/fields/SelectField';
import { Option } from 'src/types';
import {
  updateSalesPromotionContactStatuses,
} from '@adnz/api-ws-funnel';
import { createFinalFormDecorator } from '@adnz/scroll-to-error';
import { scrollTo } from 'src/helpers';
import { getValue } from 'src/components/ReactSelectV2Field';
import { useDispatch, useSelector } from '../../../context';
import * as selectors from '../../../selectors';
import { FormValues } from './form';
import * as actions from '../../../actions';
import validate from './validate';

const ChangeContactStatusForm:React.FC<{ salesPromotionId: string }> = ({ salesPromotionId }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const isOpened = useSelector(selectors.isChangeContactStatusOpened, []);
  const selectedContactIds = useSelector(selectors.getSelectedContactIds, []);
  const promotion = useSelector(selectors.getPromotionDetails, []);
  const statusOptions = promotion?.contactStatuses?.map((s: string) => ({ label: s, value: s }));

  const [,, pushContacts] = useRequest({
    apiMethod: updateSalesPromotionContactStatuses,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (newItem) => {
        notify.success('', t('serviceDashboard:CONTACTS_PUSHED'));
        dispatch(actions.UPDATE_PROMOTION(newItem));
      },
      [dispatch, t],
    ),
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      pushContacts(selectedContactIds, { status: getValue(values.status) ?? '', salesPromotionId });
    },
    [pushContacts, selectedContactIds, salesPromotionId],
  );

  const handleClose = useCallback(
    () => {
      dispatch(actions.CLOSE_MODAL());
    },
    [dispatch],
  );

  const scrollOnFail = React.useMemo(
    () => createFinalFormDecorator<FormValues>({
      scrollTo,
    }),
    [],
  );

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      validate={validate}
      decorators={[scrollOnFail]}
      render={({
        handleSubmit,
        submitting,
      }) => (
        <>
          <form onSubmit={handleSubmit}>
            <Modal
              isOpen={isOpened}
              onRequestClose={handleClose}
              title={t('serviceDashboard:SET_CONTACT_STATUS')}
            >
              <Modal.Body>
                <FormGroup>
                  <Col md={12}>
                    <Label required>{t('serviceDashboard:STATUS')}</Label>
                    <Field<Option<string>>
                      name="status"
                      render={(props) => (
                        <SelectField
                          formatOptionLabel={(option) => t(option.label)}
                          options={statusOptions}
                          {...props}
                        />
                      )}
                    />
                    <Error name="status" />
                  </Col>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <ButtonGroup>
                  <Button
                    theme="create-secondary"
                    onClick={handleClose}
                  >
                    {t('serviceDashboard:CLOSE')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    isLoading={submitting}
                    onClick={handleSubmit}
                  >
                    {t('serviceDashboard:SET_CONTACT_STATUS')}
                  </Button>
                </ButtonGroup>
              </Modal.Footer>
            </Modal>
          </form>
        </>
      )}
    />
  );
};

export default ChangeContactStatusForm;
