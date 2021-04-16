import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import CreateForm from '../CreateForm';

const CreateModal = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeCreateModal()),
    [dispatch],
  );
  const isModalOpened = useSelector(selectors.isCreateModalOpened);
  return (
    <Modal
      isOpen={isModalOpened}
      onRequestClose={closeModal}
      title={t('serviceDashboard:CREATE_ACTIVITY')}
    >
      <CreateForm closeModal={closeModal} />
    </Modal>
  );
};

export default CreateModal;
