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
import Error from 'src/components/form/Error';
import SelectField from 'src/components/form/fields/SelectField';
import AsyncCreatableSelectField from 'src/components/form/fields/AsyncCreatableSelectField';
import {
  getTags,
  TagType,
  UserShort,
  getSalesPersons,
  getSalesPromotionById,
  createTaskBatch,
  SourceDto,
  getSources,
} from '@adnz/api-ws-funnel';
import { Option } from 'src/types';
import TextareaField from 'src/components/form/fields/TextareaField';
import AsyncSelectField from 'src/components/form/fields/AsyncSelectField';
import { ICONS } from 'src/constants';
import CheckboxField from 'src/components/form/fields/CheckboxField';
import { CheckboxGroup } from 'src/scenes/Administration/containers/AdTags/containers/AdTagsTable/styles';
import { createFinalFormDecorator } from '@adnz/scroll-to-error';
import { scrollTo } from 'src/helpers';
import * as selectors from '../../../selectors';
import { useDispatch, useSelector } from '../../../context';
import { prepareValues, FormValues, priorityOptions } from './form';
import * as actions from '../../../actions';
import validate from './validate';

const GenerateLeadsForm:React.FC<{ salesPromotionId: string }> = ({ salesPromotionId }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const isOpened = useSelector(selectors.isGenerateLeadsOpened, []);
  const selectedAccountIds = useSelector(selectors.getSelectedAccountIds, []);
  const initialValues = useMemo(() => ({
    accountIds: selectedAccountIds,
    salesPromotionId,
    isImportant: false,
    assignToDefaultSalesContact: false,
    priority: { label: 'LOW', value: 'LOW' },
  }), [selectedAccountIds, salesPromotionId]);

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

  const [, { pending: isLoadingSales }, getSales] = useRequest({
    apiMethod: getSalesPersons,
    runOnMount: false,
  });

  const handleLoadSales = React.useCallback(
    async (): Promise<Option<string>[]> => {
      const items = await getSales({ prefix: '' });

      return items.map((item: UserShort) => ({
        value: item.id,
        label: item.name ?? '',
      }));
    },
    [getSales],
  );

  const [, { pending: isLoadingSources }, loadLeadSources] = useRequest({
    apiMethod: getSources,
    runOnMount: false,
  });

  const handleLoadLeadSources = React.useCallback(
    async (nameFilter): Promise<Option<string>[]> => {
      const { items } = await loadLeadSources({
        limit: 100,
        page: 0,
        sort: 'name',
        order: 'asc',
        nameFilter,
      });

      return items.map((item: SourceDto) => ({
        value: item.id ?? '',
        label: item.name ?? '',
      }));
    },
    [loadLeadSources],
  );

  const [,, getPromotion] = useRequest({
    apiMethod: getSalesPromotionById,
    onSuccess: React.useCallback(
      (data) => {
        dispatch(actions.SAVE_PROMOTION_DETAILS(data));
      },
      [dispatch],
    ),
  });

  const [,, create] = useRequest({
    apiMethod: createTaskBatch,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      async () => {
        await getPromotion({ salesPromotionId });
        notify.success('', t('serviceDashboard:TASKS_CREATED'));
        dispatch(actions.CLOSE_MODAL());
      },
      [t, getPromotion, salesPromotionId, dispatch],
    ),
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      create(prepareValues(values));
    },
    [create],
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
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            isOpen={isOpened}
            onRequestClose={handleClose}
            title={t('serviceDashboard:CREATE_LEADS')}
          >
            <Modal.Body>
              <FormGroup>
                <Col md={6}>
                  <Label required>{t('serviceDashboard:PRIORITY')}</Label>
                  <Field<Option<string>>
                    name="priority"
                    render={(props) => (
                      <SelectField
                        formatOptionLabel={(option) => t(option.label)}
                        options={priorityOptions}
                        {...props}
                      />
                    )}
                  />
                  <Error name="priority" />
                </Col>
                <CheckboxGroup>
                  <Label>
                    <Field
                      type="checkbox"
                      name="isImportant"
                      render={(props) => <CheckboxField {...props} />}
                    />
                    <span>{String.fromCodePoint(ICONS.ROCKET)}</span>
                  </Label>
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Col md={6}>
                  <Label>{t('serviceDashboard:ASSIGNEE')}</Label>
                  <Field<FormValues['assignee']>
                    name="assignee"
                    render={(props) => (
                      <AsyncSelectField
                        isDisabled={values.assignToDefaultSalesContact}
                        isLoading={isLoadingSales}
                        defaultOptions
                        isClearable
                        loadOptions={handleLoadSales}
                        {...props}
                      />
                    )}
                  />
                </Col>
                <CheckboxGroup>
                  <Label>
                    <Field
                      type="checkbox"
                      name="assignToDefaultSalesContact"
                      render={(props) => <CheckboxField {...props} />}
                    />
                    <span css="margin-left: 10px;">{t('serviceDashboard:ASSIGN_TO_DEFAULT_SALES')}</span>
                  </Label>
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Col md={12}>
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
                <Col md={6}>
                  <Label required>{t('serviceDashboard:LEAD_SOURCE')}</Label>
                  <Field<Option<string>>
                    name="leadSource"
                    render={(props) => (
                      <AsyncSelectField
                        defaultOptions
                        isLoading={isLoadingSources}
                        loadOptions={handleLoadLeadSources}
                        {...props}
                      />
                    )}
                  />
                  <Error name="priority" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col md={12}>
                  <Label>{t('serviceDashboard:COMMENT')}</Label>
                  <Field<string>
                    name="message"
                    render={(props) => <TextareaField {...props} />}
                  />
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
                  {t('serviceDashboard:GENERATE_LEADS')}
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Modal>
        </form>
      )}
    />
  );
};

export default GenerateLeadsForm;
