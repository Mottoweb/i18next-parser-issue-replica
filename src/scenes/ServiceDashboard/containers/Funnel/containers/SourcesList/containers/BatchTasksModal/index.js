import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import Form from './form';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const BatchTasksModal = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const isModalOpened = useSelector(selectors.isBatchModalOpened);
  const id = useSelector(selectors.getBatchModalOpenedId);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  return (
    <Modal
      isOpen={isModalOpened}
      onRequestClose={closeModal}
      id="create-task-batch-modal-window"
      title={t('serviceDashboard:CREATE_TASK_BATCH')}
    >
      <Form itemId={id} />
    </Modal>
  );
};

export default BatchTasksModal;
