import React from 'react';
import { Modal, Button, ButtonGroup } from '@adnz/ui';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/selectors';
import * as actions from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/actions';

const DeleteModal = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const visible = useSelector(selectors.isRestoringArchivedTask);
  const dispatch = useDispatch();
  const onClose = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  const onSubmit = React.useCallback(
    () => dispatch(actions.restoreArchivedTask()),
    [dispatch],
  );
  return (
    <Modal
      isOpen={visible}
      onRequestClose={onClose}
      title={t('serviceDashboard:RESTORE_TASK')}
    >
      <Modal.Body>
        <p>{t('serviceDashboard:RESTORE_TASK_CONFIRM')}</p>
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button
            theme="create-secondary"
            onClick={onClose}
          >
            {t('serviceDashboard:CLOSE')}
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
          >
            {t('serviceDashboard:SUBMIT')}
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
