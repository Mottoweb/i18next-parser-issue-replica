import React from 'react';
import { AccountDto, CampaignDto } from '@adnz/api-ws-salesforce';
import { useTranslation } from 'react-i18next';
import AddressLine from '../components/AddressLine';
import Container from '../components/Container';

const Body: React.FC<{ campaign: CampaignDto }> = ({ campaign }) => (
  <Container>
    <AddressLine postal account={campaign.advertiserAccount as AccountDto} />
  </Container>
);

const Footer:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <Container>
      {campaign.advertiserContact && campaign.advertiserContact.firstName && (
        <div>
          <span>{campaign.advertiserContact.firstName}</span>
        </div>
      )}
      {campaign.advertiserContact && campaign.advertiserContact.lastName && (
        <div>
          <span>{campaign.advertiserContact.lastName}</span>
        </div>
      )}
      {campaign.advertiserContact && campaign.advertiserContact.email && (
        <div>
          <a href={`mailto:${campaign.advertiserContact.email}`}>{campaign.advertiserContact.email}</a>
        </div>
      )}
      {campaign.advertiserAccount && campaign.advertiserAccount.phone && (
        <div>
          <span>
            {`${t('serviceDashboard:TEL')} `}
            <a href={`tel:${campaign.advertiserAccount.phoneNoFormatting}`}>{campaign.advertiserAccount.phone}</a>
          </span>
        </div>
      )}
    </Container>
  );
};

export default {
  Body,
  Footer,
};
