import React from 'react';
import styled from 'styled-components';
import Colors from 'src/theme/Colors';
import Media from 'src/theme/Media';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import * as selectors from 'src/selectors';

const Value = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  color: ${Colors['greyish-brown']};
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 5px 0;
`;

const TwoColumnContainer = styled.div`
  background: #fff;
  display: flex;
  flex: 1;
  padding: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
  @media ${Media.xsMax} {
    padding: 20px;
  }
  & ${ValueContainer} {
    width: 50%;
  }
`;

const ThreeColumnContainer = styled(TwoColumnContainer)`
  @media ${Media.smMin} {
    & ${ValueContainer} {
      width: 33%;
    }
  }
`;

const Key = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 11px;
  color: ${Colors['brown-grey-two']};
  &:not(:first-of-type) {
    margin-top: 10px;
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  & > ${ThreeColumnContainer} {
    margin-left: 10px;
    @media ${Media.xsMax} {
      margin-left: 0;
      margin-top: 10px;
    }
  }
  margin-top: 10px;
  @media ${Media.xsMax} {
    flex-direction: column;
    margin-left: 0;
    margin-top: 10px;
  }
`;

const Details = ({
  account,
  industry,
}) => {
  const { t, i18n } = useTranslation(['translation', 'common', 'serviceDashboard']);
  const hasPermission = !!account.get('hasPermission');
  if (!hasPermission) {
    return null;
  }
  return (
    <PrivateRoute
      roles={[Roles.AGENCY, Roles.SELF_BOOKING, Roles.MANAGE_ACCOUNTS]}
      render={() => (
        <DetailsContainer>
          <TwoColumnContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:PARENT_ACCOUNT')}</Key>
              <Value>{account.get('parentAccountName') || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:INDUSTRY')}</Key>
              <Value>
                {(industry
                  && industry.get(`name${i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)}`)) || '\u2014'}
              </Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:LANGUAGE')}</Key>
              <Value>{t(account.get('language')) || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:TELEPHONE')}</Key>
              <Value>{account.get('phone') || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:ZONE')}</Key>
              <Value>{t(account.get('zone')) || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:SEGMENT')}</Key>
              <Value>{t(account.get('segment')) || '\u2014'}</Value>
            </ValueContainer>
          </TwoColumnContainer>
          <ThreeColumnContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:SALES_CONTACT')}</Key>
              <Value>{account.get('owner') || '\u2014'}</Value>
              <Key>{t('serviceDashboard:DEFAULT_ACCOUNT_CONTACT')}</Key>
              <Value>{account.get('defaultAccountContactName') || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:AGENCY')}</Key>
              <Value>{account.get('defaultAgencyAccountName') || '\u2014'}</Value>
              <Key>{t('serviceDashboard:AGENCY_CONTACT')}</Key>
              <Value>{account.get('defaultAgencyContactName') || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:BROKER')}</Key>
              <Value>{account.get('defaultBrokerAccountName') || '\u2014'}</Value>
              <Key>{t('serviceDashboard:BROKER_CONTACT')}</Key>
              <Value>{account.get('defaultBrokerContactName') || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:DISCOUNT')}</Key>
              <Value>{account.get('yearlyDiscount') || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:CONSULTANCY_COMMISSION')}</Key>
              <Value>{account.get('consultancyCommission') || '\u2014'}</Value>
            </ValueContainer>
            <ValueContainer>
              <Key>{t('serviceDashboard:BROKER_COMMISSION')}</Key>
              <Value>{account.get('brokerCommission') || '\u2014'}</Value>
            </ValueContainer>
          </ThreeColumnContainer>
        </DetailsContainer>
      )}
    />
  );
};

export default connect(
  (state, { account }) => ({
    industry: selectors.getIndustry(state, { itemId: account.get('industry') }),
  }),
)(Details);
