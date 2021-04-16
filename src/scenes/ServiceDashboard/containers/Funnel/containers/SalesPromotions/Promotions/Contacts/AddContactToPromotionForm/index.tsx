import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import {
  Button, ButtonGroup, FormGroup, Label, Modal,
} from '@adnz/ui';
import { Form, Field } from 'react-final-form';
import notify from 'src/modules/Notification';
import { Col } from 'styled-bootstrap-grid';
import {
  addSalesPromotionContacts, getSalesPromotions, SalesPromotionDto,
} from '@adnz/api-ws-funnel';
import { getValue } from 'src/helpers';
import AsyncSelectField from 'src/components/form/fields/AsyncSelectField';
import { Option } from 'src/types';
import Error from 'src/components/form/Error';
import * as selectors from '../../../selectors';
import { useDispatch, useSelector } from '../../../context';
import { prepareValues, FormValues } from './form';
import * as actions from '../../../actions';
import validate from './validate';

const AddContactToPromotionForm:React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const isOpened = useSelector(selectors.isAddToPromotionOpened, []);
  const selectedContactIds = useSelector(selectors.getSelectedContactIds, []);
  const initialValues = useMemo(() => ({
    contactIds: selectedContactIds,
  }), [selectedContactIds]);

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
      () => {
        notify.success('', t('serviceDashboard:CONTACTS_PUSHED'));
        dispatch(actions.CLOSE_MODAL());
      },
      [dispatch, t],
    ),
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      pushContacts(prepareValues(values), { salesPromotionId: getValue(values.salesPromotionId) });
    },
    [pushContacts],
  );

  const [, { pending }, getPromotions] = useRequest({
    apiMethod: getSalesPromotions,
    runOnMount: false,
  });

  const handleLoadPromotions = React.useCallback(
    async (nameFilter): Promise<Option<string>[]> => {
      const { items } = await getPromotions({
        page: 0,
        sort: 'name',
        limit: 100,
        order: 'asc',
        searchFilter: nameFilter,
      });

      return items.map((item: SalesPromotionDto) => ({
        value: item.id ?? '',
        label: item.name,
      }));
    },
    [getPromotions],
  );

  const handleClose = useCallback(
    () => {
      dispatch(actions.CLOSE_MODAL());
    },
    [dispatch],
  );

  return (
    <Form<FormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      render={({
        handleSubmit,
        submitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            isOpen={isOpened}
            onRequestClose={handleClose}
            title={t('serviceDashboard:ADD_CONTACTS_TO_PROMOTION')}
          >
            <Modal.Body>
              <FormGroup>
                <Col md={6}>
                  <Label required>{t('serviceDashboard:SALES_PROMOTION')}</Label>
                  <Field<Option<string>>
                    name="salesPromotionId"
                    render={(props) => (
                      <AsyncSelectField
                        isLoading={pending}
                        defaultOptions
                        isClearable
                        loadOptions={handleLoadPromotions}
                        {...props}
                      />
                    )}
                  />
                  <Error name="salesPromotionId" />
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
                  {t('serviceDashboard:ADD_TO_PROMOTION')}
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Modal>
        </form>
      )}
    />
  );
};

export default AddContactToPromotionForm;
