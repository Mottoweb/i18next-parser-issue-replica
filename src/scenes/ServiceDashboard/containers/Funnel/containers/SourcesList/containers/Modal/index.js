import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import Form from '../Form';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const FormModal = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const isModalOpened = useSelector(selectors.isModalOpened);
  const isEditModal = useSelector(selectors.isEditModal);
  const id = useSelector(selectors.getOpenedId);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  return (
    <Modal
      isOpen={isModalOpened}
      onRequestClose={closeModal}
      title={t(isEditModal ? 'EDIT_SOURCE' : 'CREATE_SOURCE')}
      id="create-source-modal-window"
    >
      <Form closeModal={closeModal} itemId={id} />
    </Modal>
  );
};

export default FormModal;
