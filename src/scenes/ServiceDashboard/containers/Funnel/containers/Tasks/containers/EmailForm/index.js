import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import EmailForm from './form';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const FormModal = ({
  taskId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeEmailModal()),
    [dispatch],
  );
  const isModalOpened = useSelector(selectors.isEmailModalOpened);
  return (
    <Modal
      isOpen={isModalOpened}
      onRequestClose={closeModal}
      title={t('serviceDashboard:SEND_DIRECT_EMAIL')}
    >
      <Modal.Body>
        <EmailForm taskId={taskId} />
      </Modal.Body>
    </Modal>
  );
};

FormModal.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default FormModal;
