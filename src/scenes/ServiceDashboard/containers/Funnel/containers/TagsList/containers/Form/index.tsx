import React from 'react';
import { Map } from 'immutable';
import { useTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form/immutable';
import { FormErrors, InjectedFormProps } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';

import { TagDto as TagType } from '@adnz/api-ws-funnel';
import {
  Alert,
  Modal,
  Button,
  ButtonGroup,
  Label,
} from '@adnz/ui';

import i18n from 'src/i18n';
import TextV2Field from 'src/components/TextV2Field';
import CheckboxField from 'src/components/form/fields/CheckboxField';
import FieldDecorator, { formDecorator } from 'src/components/FieldDecorator';

import * as actions from '../../actions';
import * as selectors from '../../selectors';

type Errors = {
  name?: string
};

const validate = (values: Map<string, keyof TagType>): FormErrors<Errors> => {
  const errors: FormErrors<Errors> = {};

  if (!values.get('name')) {
    errors.name = i18n.t('serviceDashboard:NAME_REQUIRED');
  }

  return errors;
};

const TagComponent: React.FC<InjectedFormProps> = ({
  handleSubmit,
  error,
  submitting,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <>
      {error && <Alert type="error" message={error} />}
      <form autoComplete="false" onSubmit={handleSubmit}>
        <Modal.Body>
          <Field
            name="name"
            component={TextV2Field}
            type="text"
            // TODO: fix
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderLayout={(props: any) => (
              <FieldDecorator
                size={12}
                label={t('serviceDashboard:NAME')}
                labelSize={12}
                {...props}
              />
            )}
          />
          <Label
            type="inline-checkbox"
          >
            <Field
              name="active"
              type="checkbox"
              square
              component={CheckboxField}
              renderLayout={formDecorator('', {
                inlineField: true,
              })}
            />
            <span>{t('serviceDashboard:ACTIVE')}</span>
          </Label>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
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

// TODO: fix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TagForm = reduxForm<Map<string, keyof TagType>, any>({
  form: 'tag-form',
  enableReinitialize: true,
  validate,
})(TagComponent);

export interface ITag {
  itemId: string
}

const Tag: React.FC<ITag> = ({
  itemId,
}) => {
  const initialValues = useSelector(selectors.getInitialValues);
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => (itemId
      ? dispatch(actions.update(itemId, data.toJS()))
      : dispatch(actions.create(data.toJS()))),
    [dispatch, itemId],
  );

  return (
    <TagForm
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
};

export default Tag;
