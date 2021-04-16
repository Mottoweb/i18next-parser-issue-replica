import React from 'react';
import PropTypes from 'prop-types';
import Box from 'src/scenes/ServiceDashboard/containers/Campaign/components/DetailsInfoBlock/components/Box';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BoxesRow } from 'src/scenes/ServiceDashboard/containers/Campaign/components/DetailsInfoBlock/styles';
import { PrivateRoute, Roles } from '@adnz/use-auth';
import AccountAddress from '../AccountAddress';
import Revenue from '../../containers/Revenue';
import Emails from '../Emails';

const StyledBox = styled(Box)`
  background: #fff;
  align-items: center;
  justify-content: center;
  flex: auto;
`;

const DetailsRow = ({ account, className }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <BoxesRow
      data-testid="details-boxes-row"
      className={className}
    >
      <StyledBox
        title={`${t('serviceDashboard:ACCOUNT')} ${t('serviceDashboard:ADDRESS')}`}
        body={<AccountAddress.Body postal account={account.toJS()} />}
        footer={<AccountAddress.Footer postal account={account.toJS()} />}
      />
      <PrivateRoute
        roles={Roles.ADMIN_INVOICE}
      >
        <StyledBox
          title={`${t('serviceDashboard:INVOICE')} ${t('serviceDashboard:ADDRESS')}`}
          body={<AccountAddress.Body account={account.toJS()} />}
        />
      </PrivateRoute>
      <StyledBox
        title={t('serviceDashboard:EMAILS')}
        body={<Emails.Body account={account} />}
      />
      <StyledBox
        title={t('serviceDashboard:REVENUE')}
        body={<Revenue itemId={account.get('id')} />}
      />
    </BoxesRow>
  );
};

DetailsRow.propTypes = {
  className: PropTypes.string,
};

DetailsRow.defaultProps = {
  className: '',
};

export default DetailsRow;
