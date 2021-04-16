import React from 'react';
import { AccountDto, CampaignDto } from '@adnz/api-ws-salesforce';
import AddressLine from '../components/AddressLine';
import ContactLine from '../components/ContactLine';
import Container from '../components/Container';

const Body:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => (
  <Container>
    <AddressLine postal account={campaign.agencyAccount as AccountDto} />
  </Container>
);

const Footer:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => (
  <Container>
    {
      !!campaign.agencyContact
      && <ContactLine contact={campaign.agencyContact} />
    }
  </Container>
);

export default {
  Body,
  Footer,
};
