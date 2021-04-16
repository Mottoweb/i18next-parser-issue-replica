import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import arrayMutators from 'final-form-arrays';
import {
  Button, ButtonGroup, FormGroup, Label, Modal,
} from '@adnz/ui';
import { Form, Field } from 'react-final-form';
import notify from 'src/modules/Notification';
import { Col } from 'styled-bootstrap-grid';
import TextField from 'src/components/form/fields/TextField';
import Error from 'src/components/form/Error';
import SelectField from 'src/components/form/fields/SelectField';
import AsyncCreatableSelectField from 'src/components/form/fields/AsyncCreatableSelectField';
import DatePickerField from 'src/components/form/fields/DatePickerField';
import { OnChange } from 'react-final-form-listeners';
import {
  getTags,
  TagType,
  createSalesPromotion,
  updateSalesPromotion,
  getSalesPromotionsTypeConfigs,
  getSalesPromotionTypeConfigById,
  SalesPromotionTypeConfig,
} from '@adnz/api-ws-funnel';
import { Option } from 'src/types';
import TextareaField from 'src/components/form/fields/TextareaField';
import AsyncSelectField from 'src/components/form/fields/AsyncSelectField';
import { createFinalFormDecorator } from '@adnz/scroll-to-error';
import { scrollTo } from 'src/helpers';
import { DateTimeUnixType } from '@adnz/api-helpers';
import { useDispatch, useSelector } from '../../../context';
import * as selectors from '../../../selectors';
import { prepareInitialValues, prepareValues, FormValues } from './form';
import * as actions from '../../../actions';
import validate from './validate';
import StatusFields from '../../../StatusFields';

const EditContactForm:React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const promotion = useSelector(selectors.getPromotionDetails, []);
  const isOpened = useSelector(selectors.isPromotionModalOpened, []);

  const initialValues = useMemo(
    () => (promotion ? prepareInitialValues(promotion) : {}),
    [promotion],
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

  const [, { pending }, loadTypes] = useRequest({
    apiMethod: getSalesPromotionsTypeConfigs,
    runOnMount: false,
  });

  const [, , getTypeConfig] = useRequest({
    apiMethod: getSalesPromotionTypeConfigById,
    runOnMount: false,
  });

  const handleLoadTypeConfigs = React.useCallback(
    async (nameFilter): Promise<Option<string>[]> => {
      const { items } = await loadTypes({
        page: 0,
        sort: 'name',
        limit: 100,
        order: 'asc',
        searchFilter: nameFilter,
      });

      return items.map((item: SalesPromotionTypeConfig) => ({
        value: item.id ?? '',
        label: item.name,
      }));
    },
    [loadTypes],
  );

  const [,, create] = useRequest({
    apiMethod: createSalesPromotion,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (newItem) => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_CREATED'));
        dispatch(actions.SAVE_PROMOTION(newItem));
      },
      [dispatch, t],
    ),
  });

  const [,, update] = useRequest({
    apiMethod: updateSalesPromotion,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (newItem) => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_UPDATED'));
        dispatch(actions.UPDATE_PROMOTION(newItem));
      },
      [dispatch, t],
    ),
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      if (promotion) {
        update(prepareValues(values), { salesPromotionId: promotion.id });
      } else {
        create(prepareValues(values));
      }
    },
    [create, update, promotion],
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
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      mutators={{ ...arrayMutators }}
      decorators={[scrollOnFail]}
      render={({
        handleSubmit,
        submitting,
        form,
      }) => (
        <>
          <form onSubmit={handleSubmit}>
            <Modal
              isOpen={isOpened}
              onRequestClose={handleClose}
              title={t('serviceDashboard:SALES_PROMOTION')}
            >
              <Modal.Body>
                <h3>{t('serviceDashboard:DETAILS')}</h3>
                <FormGroup>
                  <Col md={6}>
                    <Label required>{t('serviceDashboard:NAME')}</Label>
                    <Field<string>
                      name="name"
                      render={(props) => (
                        <TextField {...props} />
                      )}
                    />
                    <Error name="name" />
                  </Col>
                  <Col md={6}>
                    <Label required>{t('serviceDashboard:STATUS')}</Label>
                    <Field<Option<string>>
                      name="status"
                      render={(props) => (
                        <SelectField
                          formatOptionLabel={(option) => t(option.label)}
                          options={[
                            { value: 'ACTIVE', label: t('serviceDashboard:ACTIVE') },
                            { value: 'INACTIVE', label: t('serviceDashboard:INACTIVE') },
                            { value: 'CANCELED', label: t('serviceDashboard:CANCELED') },
                          ]}
                          {...props}
                        />
                      )}
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col md={6}>
                    <Label required>{t('serviceDashboard:TYPE_CONFIG')}</Label>
                    <Field<Option<string>>
                      name="typeConfigId"
                      render={(props) => (
                        <AsyncSelectField
                          isLoading={pending}
                          defaultOptions
                          isClearable
                          loadOptions={handleLoadTypeConfigs}
                          {...props}
                        />
                      )}
                    />
                    <OnChange<FormValues['typeConfigId']> name="typeConfigId">
                      {async (option) => {
                        if (!promotion && option?.value) {
                          const typeConfig = await getTypeConfig({ typeConfigId: option.value });
                          form.change('contactStatuses', typeConfig.statuses ?? [typeConfig.statuses]);
                        }
                      }}
                    </OnChange>
                    <Error name="typeConfigId" />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col md={6}>
                    <Label>{t('serviceDashboard:LABELS')}</Label>
                    <Field<Option<string>[]>
                      name="tags"
                      render={(props) => (
                        <AsyncCreatableSelectField<Option<string>, true>
                          isMulti
                          defaultOptions
                          loadOptions={handleLoadTags}
                          {...props}
                        />
                      )}
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col md={4}>
                    <Label required>{t('serviceDashboard:START_DATE')}</Label>
                    <Field<DateTimeUnixType>
                      name="startDate"
                      render={(props) => (
                        <DatePickerField
                          disabledKeyboardNavigation
                          showWeekNumbers
                          {...props}
                        />
                      )}
                    />
                  </Col>
                  <Col md={4}>
                    <Label required>{t('serviceDashboard:END_DATE')}</Label>
                    <Field<DateTimeUnixType>
                      name="endDate"
                      render={(props) => (
                        <DatePickerField
                          disabledKeyboardNavigation
                          showWeekNumbers
                          {...props}
                        />
                      )}
                    />
                  </Col>
                  <Col md={4}>
                    <Label>{t('serviceDashboard:DEADLINE')}</Label>
                    <Field<DateTimeUnixType>
                      name="deadline"
                      render={(props) => (
                        <DatePickerField
                          disabledKeyboardNavigation
                          showWeekNumbers
                          {...props}
                        />
                      )}
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col md={12}>
                    <Label>{t('serviceDashboard:DESCRIPTION')}</Label>
                    <Field<string>
                      name="description"
                      render={(props) => (
                        <TextareaField {...props} />
                      )}
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col md={6}>
                    <Label>{t('serviceDashboard:GOAL_REVENUE')}</Label>
                    <Field<string>
                      name="revenueGoal"
                      render={(props) => (
                        <TextField settings={{ floatOnly: true }} {...props} />
                      )}
                    />
                  </Col>
                </FormGroup>
                <StatusFields field="contactStatuses" />
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
                    {promotion ? t('serviceDashboard:EDIT_PROMOTION') : t('serviceDashboard:CREATE_PROMOTION')}
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

export default EditContactForm;
