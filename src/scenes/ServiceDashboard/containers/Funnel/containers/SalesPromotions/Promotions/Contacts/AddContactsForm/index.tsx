import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import arrayMutators from 'final-form-arrays';
import {
  Button, ButtonGroup, Modal,
} from '@adnz/ui';
import { Form } from 'react-final-form';
import notify from 'src/modules/Notification';
import {
  addSalesPromotionContacts,
} from '@adnz/api-ws-funnel';
import { useDispatch, useSelector } from '../../../context';
import * as selectors from '../../../selectors';
import ContactsList from './ContactsList';
import { prepareContactValues, FormValues } from './form';
import * as actions from '../../../actions';

const AddContactsForm: React.FC<{ salesPromotionId: string }> = ({ salesPromotionId }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const isOpened = useSelector(selectors.isAddContactsOpened, []);

  const [,, pushContacts] = useRequest({
    apiMethod: addSalesPromotionContacts,
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
      pushContacts(prepareContactValues(values), { salesPromotionId });
    },
    [pushContacts, salesPromotionId],
  );

  const handleClose = useCallback(
    () => {
      dispatch(actions.CLOSE_MODAL());
    },
    [dispatch],
  );

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={({
        handleSubmit,
        submitting,
      }) => (
        <>
          <form onSubmit={handleSubmit}>
            <Modal
              isOpen={isOpened}
              onRequestClose={handleClose}
              title={t('serviceDashboard:ADD_CONTACTS')}
            >
              <Modal.Body>
                <ContactsList />
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
                    {t('serviceDashboard:SAVE')}
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

export default AddContactsForm;
