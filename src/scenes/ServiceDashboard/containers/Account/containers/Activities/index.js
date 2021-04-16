import * as React from 'react';
import SectionTitle from 'src/components/SectionTitle';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAccount, isPermissionsToAccount } from 'src/selectors';
import PropTypes from 'prop-types';
import AccountActivities from './containers/AccountActivities';

const Activities = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const account = useSelector((state) => getAccount(state, { itemId }));

  return (
    <>
      <SectionTitle>{t('serviceDashboard:ACTIVITIES')}</SectionTitle>
      <AccountActivities account={account} />
    </>
  );
};

Activities.propTypes = {
  itemId: PropTypes.string.isRequired,
};

const ActivitiesWrapper = ({ itemId }) => {
  const visible = useSelector((state) => isPermissionsToAccount(state, { itemId }));
  if (!visible) {
    return null;
  }
  return (
    <Activities itemId={itemId} />
  );
};

ActivitiesWrapper.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default ActivitiesWrapper;
