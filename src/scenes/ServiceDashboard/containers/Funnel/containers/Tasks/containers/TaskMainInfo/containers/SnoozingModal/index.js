import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Modal, Button, ButtonGroup, Label, FormGroup,
} from '@adnz/ui';

import {
  Col,
} from 'styled-bootstrap-grid';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import SingleDatePicker from 'src/components/SingleDatePicker';
import TextareaField from 'src/components/TextareaV2Field';
import moment from 'moment';
import FieldDecorator from 'src/components/FieldDecorator';
import * as selectors from '../../../../selectors';
import * as actions from '../../../../actions';

const FormModalComponent = ({
  handleSubmit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const enabledSubmit = useSelector(selectors.isSnoozingDateSelected);
  const isSnoozed = useSelector(selectors.isOpenedTaskSnoozed);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeSnoozeModal()),
    [dispatch],
  );
  const backToTask = React.useCallback(
    () => dispatch(actions.declineSnoozing()),
    [dispatch],
  );
  const handleDateSelect = React.useCallback(
    (date) => {
      dispatch(actions.handleDateSelect(date));
    },
    [dispatch],
  );
  return (
    <Modal
      isOpen
      onRequestClose={closeModal}
      title={t('serviceDashboard:SNOOZE_TASK')}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <FormGroup>
            <Col xs={12}>
              <Label required>{t('serviceDashboard:SELECT_SNOOZING_DATE')}</Label>
              <SingleDatePicker
                onChange={handleDateSelect}
                isVisible
                minDate={moment()}
              />
            </Col>
          </FormGroup>
          <Field
            name="comment"
            type="text"
            component={TextareaField}
            renderLayout={(props) => (
              <FieldDecorator
                size={12}
                labelSize={12}
                label={t('serviceDashboard:LEAVE_THE_MESSAGE')}
                {...props}
              />
            )}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            {isSnoozed && (
              <Button
                theme="create-secondary"
                onClick={backToTask}
              >
                {t('serviceDashboard:BACK_TO_TASK')}
              </Button>
            )}
            <Button
              theme="create-secondary"
              onClick={closeModal}
            >
              {t('serviceDashboard:CLOSE')}
            </Button>
            <Button
              type="submit"
              disabled={!enabledSubmit}
            >
              {t('serviceDashboard:SUBMIT')}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

FormModalComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const FormModalForm = reduxForm({
  form: 'snooze-task-form',
  enableReinitialize: true,
})(FormModalComponent);

const FormModal = () => {
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => dispatch(actions.snoozeTask(data.get('comment'))),
    [dispatch],
  );
  const isModalOpened = useSelector(selectors.isSnoozingModalOpened);
  if (!isModalOpened) {
    return null;
  }
  return (
    <FormModalForm
      onSubmit={onSubmit}
    />
  );
};

export default FormModal;
