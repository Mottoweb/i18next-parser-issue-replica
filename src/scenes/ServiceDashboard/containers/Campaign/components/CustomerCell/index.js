import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Responsive from 'react-responsive';
import { useIdentityRoles } from '@adnz/use-auth';
import Name from '../Name';

const CustomerCell = ({
  advertiserAccount,
  responsive,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { MANAGE_ACCOUNTS } = useIdentityRoles();

  return (
    <td>
      <i>
        <Responsive maxWidth={991}>
          {!!responsive && (
            <p className="mobile-cell__label">
              {t('serviceDashboard:ADVERTISER')}
            </p>
          )}
        </Responsive>
        {!!advertiserAccount && MANAGE_ACCOUNTS && (
          <Name account={advertiserAccount} />
        )}
        {!!advertiserAccount && !MANAGE_ACCOUNTS && (
          advertiserAccount.displayName
        )}
      </i>
    </td>
  );
};

CustomerCell.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  advertiserAccount: PropTypes.shape({
    displayName: PropTypes.string,
  }).isRequired,
  responsive: PropTypes.bool.isRequired,
};

export default CustomerCell;
