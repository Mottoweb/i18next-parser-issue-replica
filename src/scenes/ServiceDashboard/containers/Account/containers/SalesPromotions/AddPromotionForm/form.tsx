import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import {
  Button, ButtonGroup, FormGroup, Label, Modal,
} from '@adnz/ui';
import { Field, useForm } from 'react-final-form';
import { Col } from 'styled-bootstrap-grid';
import Error from 'src/components/form/Error';
import {
  getSalesPromotions,
  SalesPromotionDto,
} from '@adnz/api-ws-funnel';
import SwitchField from 'src/components/form/fields/SwitchField';
import { Option } from 'src/types';
import AsyncSelectField from 'src/components/form/fields/AsyncSelectField';

interface AddPromotionFormParams {
  handleSubmit: () => void,
  opened: boolean,
  submitting: boolean,
  setOpened: (isOpened: boolean) => void;
}

export interface FormValues {
  salesPromotionId: Option<string>;
  includeContacts: boolean;
}

const AddPromotionForm: React.FC<AddPromotionFormParams> = ({
  opened, submitting, setOpened, handleSubmit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const form = useForm();
  const handleResetForm = form.reset;

  const [, { pending }, loadPromotions] = useRequest({
    apiMethod: getSalesPromotions,
    runOnMount: false,
  });

  const handleLoadPromotions = React.useCallback(
    async (nameFilter?: string): Promise<Option<string>[]> => {
      const { items } = await loadPromotions({
        page: 0,
        sort: 'name',
        limit: 100,
        order: 'asc',
        searchFilter: nameFilter,
        validAsOptions: true,
      });

      return items.map((item: SalesPromotionDto) => ({
        value: item.id ?? '',
        label: item.name,
      }));
    },
    [loadPromotions],
  );

  const handleClose = useCallback(
    () => {
      setOpened(false);
    },
    [setOpened],
  );

  useEffect(() => {
    if (!opened) {
      handleResetForm();
    }
  }, [opened, handleResetForm]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Modal
          isOpen={opened}
          onRequestClose={handleClose}
          title={t('serviceDashboard:SALES_PROMOTION')}
        >
          <Modal.Body>
            <h3>{t('serviceDashboard:DETAILS')}</h3>
            <FormGroup>
              <Col md={8}>
                <Label required>{t('serviceDashboard:SALES_PROMOTION')}</Label>
                <Field<FormValues['salesPromotionId']>
                  name="salesPromotionId"
                  render={(props) => (
                    <AsyncSelectField<FormValues['salesPromotionId'], false>
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
            <FormGroup>
              <Col md={6}>
                <Field<FormValues['includeContacts']>
                  type="checkbox"
                  name="includeContacts"
                  render={(props) => <SwitchField {...props} />}
                />
                <Label>{t('serviceDashboard:ADD_CONTACTS')}</Label>
              </Col>
            </FormGroup>
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
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  handleSubmit();
                }}
                data-testid="submit-button"
              >
                {t('serviceDashboard:ADD_ACCOUNT')}
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal>
      </form>
    </>
  );
};

export default AddPromotionForm;
