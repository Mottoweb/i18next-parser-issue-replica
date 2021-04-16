import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CreateForm from './form';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const FormModal = ({
  accountId,
  account,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  const isModalOpened = useSelector(selectors.isCreateTaskModalOpened);

  return (
    <Modal
      isOpen={isModalOpened}
      onRequestClose={closeModal}
      title={(
        <>
          {t('serviceDashboard:CREATE_LEAD_FOR')}
          {' '}
          {account.get('name')}
        </>
      )}
    >
      <CreateForm accountId={accountId} closeModal={closeModal} />
    </Modal>
  );
};

FormModal.propTypes = {
  accountId: PropTypes.string.isRequired,
  account: ImmutablePropTypes.map.isRequired,
};

export default FormModal;
