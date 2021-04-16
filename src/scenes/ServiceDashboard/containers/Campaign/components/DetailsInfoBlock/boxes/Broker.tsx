import React from 'react';
import { AccountDto, CampaignDto } from '@adnz/api-ws-salesforce';
import AddressLine from '../components/AddressLine';
import ContactLine from '../components/ContactLine';
import Container from '../components/Container';

const Body:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => (
  <Container>
    <AddressLine postal account={campaign.brokerAccount as AccountDto} />
  </Container>
);

const Footer:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => (
  <Container>
    {
      !!campaign.brokerContact
      && <ContactLine contact={campaign.brokerContact} />
    }
  </Container>
);

export default {
  Body,
  Footer,
};
