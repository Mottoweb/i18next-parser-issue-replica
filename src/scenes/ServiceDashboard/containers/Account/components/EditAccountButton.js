import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@adnz/ui';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isPermissionsToAccount } from 'src/selectors';
import { useSelector } from 'react-redux';

const EditAccountButton = ({ itemId }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const visible = useSelector((state) => isPermissionsToAccount(state, { itemId }));
  if (!visible) {
    return null;
  }
  return (
    <Button
      data-testid="edit-account-button"
      onClick={() => history.push(`/buy-side/accounts/edit/${itemId}`)}
    >
      {t('serviceDashboard:EDIT_ACCOUNT')}
    </Button>
  );
};

EditAccountButton.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default EditAccountButton;
