import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Button, ButtonGroup } from '@adnz/ui';

import {
  Col,
} from 'styled-bootstrap-grid';
import {
  Field,
  reduxForm,
} from 'redux-form/immutable';
import TextareaField from 'src/components/TextareaV2Field';
import FieldDecorator from 'src/components/FieldDecorator';
import * as actions from '../../../../actions';
import * as selectors from '../../../../selectors';

const RestoreModalComponent = ({
  handleSubmit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeRestoreModal()),
    [dispatch],
  );
  return (
    <Modal
      isOpen
      onRequestClose={closeModal}
      title={t('serviceDashboard:RESTORE_TASK')}
    >
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="form-horizontal clearfix">
            <Col md={12} className="comments-create-box">
              <Field
                name="comment"
                type="text"
                component={TextareaField}
                renderLayout={(props) => (<FieldDecorator {...props} />)}
                placeholder={t('serviceDashboard:MESSAGE')}
              />
            </Col>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              type="button"
              theme="create-secondary"
              onClick={closeModal}
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

RestoreModalComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const RestoreModalForm = reduxForm({
  form: 'restore-task-form',
  enableReinitialize: true,
})(RestoreModalComponent);

const RestoreModal = () => {
  const isModalOpened = useSelector(selectors.isRestoreModalOpened);
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    (data) => dispatch(actions.restoreTask(data.get('comment'))),
    [dispatch],
  );
  if (!isModalOpened) {
    return null;
  }
  return (
    <RestoreModalForm
      onSubmit={onSubmit}
    />
  );
};

export default RestoreModal;
