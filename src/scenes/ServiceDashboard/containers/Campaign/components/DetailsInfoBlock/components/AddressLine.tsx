import React from 'react';
import { AccountDto } from '@adnz/api-ws-salesforce';
import styled from 'styled-components';
import Colors from 'src/theme/Colors';
import { useTranslation } from 'react-i18next';
import Name from './Name';

const StyledName = styled(Name)`
  font-family: Roboto, sans-serif;
  font-size: 11px;
  display: block;
`;

const Line = styled.span`
  color: ${Colors['brown-grey-two']};
  font-family: Roboto, sans-serif;
  word-break: break-all;
  font-size: 11px;
`;

const AddressLine:React.FC<{ account?: AccountDto, postal?: boolean }> = ({
  postal,
  account,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  if (!account) return null;
  return (
    <div date-testid="address-fild">
      <StyledName account={account} />
      {(!!account.street || !!account.postalStreet) && (
        <Line id="street-filed" as="div">{postal ? account.postalStreet : account.street}</Line>
      )}
      {(!!account.street2 || !!account.postalStreet2) && (
        <Line id="street-filed-2" as="div">{postal ? account.postalStreet2 : account.street2}</Line>
      )}
      {(!!account.street3 || !!account.postalStreet3) && (
        <Line id="street-filed-3" as="div">{postal ? account.postalStreet3 : account.street3}</Line>
      )}
      <Line>
        {(!!account.countryCode || !!account.postalCountryCode) && (
          <Line id="postalCountryCode">
            {postal && account.postalCountryCode && t(account.postalCountryCode)}
            {!postal && account.countryCode && t(account.countryCode)}
            &nbsp;-&nbsp;
          </Line>
        )}
        {(!!account.zipCode || !!account.postalZipCode) && (
          <Line id="postalZipCode">
            {postal ? account.postalZipCode : account.zipCode}
            &nbsp;
          </Line>
        )}
        {(!!account.city || !!account.postalCity) && (
          <Line id="postalCity">
            {postal ? account.postalCity : account.city}
          </Line>
        )}
      </Line>
    </div>
  );
};

export default AddressLine;
