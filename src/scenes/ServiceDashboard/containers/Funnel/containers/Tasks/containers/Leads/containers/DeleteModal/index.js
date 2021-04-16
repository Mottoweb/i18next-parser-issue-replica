import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, ButtonGroup } from '@adnz/ui';

import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import ReactSelectV2Field, { getValue } from 'src/components/ReactSelectV2Field';
import { formDecorator } from 'src/components/FieldDecorator';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/selectors';
import * as actions from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/actions';

const DeleteModalComponent = ({
  handleSubmit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const outcomeOptions = useSelector(selectors.getArchiveOutcomeOptions);
  const dispatch = useDispatch();
  const handleClose = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  return (
    <Modal
      isOpen
      onRequestClose={handleClose}
      title={t('serviceDashboard:ARCHIVE_LEAD')}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Field
                name="outcome"
                component={ReactSelectV2Field}
                renderLayout={formDecorator(t('serviceDashboard:CHOOSE_ARCHIVE_REASON'))}
                options={outcomeOptions}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              type="button"
              theme="create-secondary"
              onClick={handleClose}
            >
              {t('serviceDashboard:CLOSE')}
            </Button>
            <Button
              type="submit"
            >
              {t('serviceDashboard:SUBMIT')}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

DeleteModalComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const DeleteModalForm = reduxForm({
  form: 'archive-task-form',
  enableReinitialize: true,
})(DeleteModalComponent);

const DeleteModalInner = () => {
  const dispatch = useDispatch();
  const initialValues = useSelector(selectors.getArchiveTaskInitialValue);
  const onSubmit = React.useCallback(
    (data) => dispatch(actions.deleteLeed(getValue(data.get('outcome')))),
    [dispatch],
  );
  return (
    <DeleteModalForm
      onSubmit={onSubmit}
      initialValues={initialValues}
    />
  );
};

const DeleteModal = () => {
  const isModalOpened = useSelector(selectors.isDeletingLead);
  if (!isModalOpened) {
    return null;
  }
  return (
    <DeleteModalInner />
  );
};

export default DeleteModal;
