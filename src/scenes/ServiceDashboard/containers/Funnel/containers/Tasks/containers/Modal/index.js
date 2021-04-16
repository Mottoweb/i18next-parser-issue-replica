import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import CreateForm from '../CreateForm';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const FormModal = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  const isModalOpened = useSelector(selectors.isModalOpened);
  return (
    <Modal
      isOpen={isModalOpened}
      onRequestClose={closeModal}
      title={t('serviceDashboard:CREATE_LEAD')}
    >
      <CreateForm closeModal={closeModal} />
    </Modal>
  );
};

export default FormModal;
