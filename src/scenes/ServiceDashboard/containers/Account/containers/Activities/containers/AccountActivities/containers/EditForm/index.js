import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import { change } from 'redux-form';
import {
  Alert, Button, ButtonGroup, Section,
} from '@adnz/ui';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { DATE_TIME_FORMAT_V3 } from 'src/constants';
import { TIME_ISO } from '@adnz/api-helpers';
import { useRequest } from '@adnz/use-request';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import EditActivityTypeField from 'src/modules/ActivityFormModal/components/EditActivityTypeField';
import ActivityAccountField from 'src/modules/ActivityFormModal/components/ActivityAccountField';
import ActivityContactTypeField from 'src/modules/ActivityFormModal/components/ActivityContactTypeField';
import ActivityContactField from 'src/modules/ActivityFormModal/components/ActivityContactField';
import DatePickerField from 'src/components/DatePickerV2Field';
import ReactSelectField, { getValue } from 'src/components/ReactSelectV2Field';
import TextField from 'src/components/TextV2Field';
import TextareaField from 'src/components/TextareaV2Field';
import FieldDecorator, { formDecorator } from 'src/components/FieldDecorator';
import * as actions from 'src/scenes/ServiceDashboard/containers/Account/actions';
import * as selectors from 'src/scenes/ServiceDashboard/containers/Account/selectors';
import * as funnelSelectors from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Activities/selectors';
import { getLabelValueTags } from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/actions';
import * as funnelActions from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Activities/actions';
import { getTagsByIds } from '@adnz/api-ws-funnel';
import validate from './validate';

const EditComponent = ({
  error,
  submitting,
  handleSubmit,
  activityId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const { execute: loadTags } = useEffectWithToken(
    (token, filter) => getLabelValueTags({ filter }, token),
    [],
  );
  const tagsIds = useSelector((state) => selectors.getTagsIds(state, { itemId: activityId }));
  useRequest({
    apiMethod: getTagsByIds,
    defaultData: { items: [] },
    runOnMount: true,
    parameters: [tagsIds],
    onSuccess: ({ items }) => {
      const tags = items.map((tag) => ({ label: tag.name, value: tag.id }));
      dispatch(change('edit-activity', 'tags', tags));
    },
  });

  const contactAccountId = useSelector(
    (state) => funnelSelectors.getSelectedAccountIdForContacts(state, { instance: 'edit-activity' }),
  );
  const { execute: handleAccountChange } = useEffectWithToken(
    (token, v) => {
      dispatch(change('edit-activity', 'contactId', null));
      dispatch(funnelActions.getDetailedAccount(token, getValue(v)));
    },
    [dispatch],
  );
  const closeEditForm = React.useCallback(
    () => dispatch(actions.closeActivityEditForm()),
    [dispatch],
  );
  return (
    <Section isForm>
      <form onSubmit={handleSubmit} id="edit-form">
        <Row>
          <Col md={4}>
            <EditActivityTypeField />
          </Col>
          <Col md={4}>
            <ActivityAccountField onChange={handleAccountChange} />
          </Col>
          <Col md={4}>
            <Field
              name="title"
              type="text"
              component={TextField}
              renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:TITLE'))} {...p} />}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ActivityContactTypeField />
          </Col>
          <Col md={4}>
            <ActivityContactField isDisabled={!contactAccountId} contactAccountId={contactAccountId} />
          </Col>
          <Col md={4}>
            <Field
              name="date"
              dateFormat={DATE_TIME_FORMAT_V3}
              timeFormat={TIME_ISO}
              showTimeSelect
              showLocal
              timeIntervals={15}
              component={DatePickerField}
              renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:DATE'))} wrapperClassName="datepicker-group" {...p} />}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Field
              id="labels-task-details-editing"
              name="tags"
              component={ReactSelectField}
              isClearable
              defaultOptions
              allowCreate
              isMulti
              loadOptions={loadTags}
              renderLayout={formDecorator(t('serviceDashboard:LABELS'))}
            />
          </Col>
        </Row>
        <Field
          name="message"
          type="text"
          component={TextareaField}
          renderLayout={(p) => <FieldDecorator label={(t('serviceDashboard:TOUCHPOINT_DESCRIPTION'))} requiredLabel {...p} />}
        />
        {error && <Alert type="error" message={error} />}
        <ButtonGroup>
          <Button
            id="close-edit-button"
            theme="create-secondary"
            onClick={closeEditForm}
          >
            {t('serviceDashboard:BUTTON_CLOSE')}
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            isLoading={submitting}
          >
            {t('serviceDashboard:BUTTON_UPDATE_COMMENT')}
          </Button>
        </ButtonGroup>
      </form>
    </Section>
  );
};

EditComponent.propTypes = {
  error: PropTypes.string,
  activityId: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

EditComponent.defaultProps = {
  error: undefined,
};

const EditForm = reduxForm({
  form: 'edit-activity',
  enableReinitialize: true,
  validate,
})(EditComponent);

const Edit = ({ activityId, onSubmit }) => {
  const initialValues = useSelector(
    (state) => funnelSelectors.getActivityInitialValues(state, { itemId: activityId }),
  );
  return (
    <EditForm
      activityId={activityId}
      onSubmit={onSubmit}
      initialValues={initialValues}
    />
  );
};

Edit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default Edit;
