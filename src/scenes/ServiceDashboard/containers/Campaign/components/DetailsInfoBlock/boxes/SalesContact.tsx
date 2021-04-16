import React from 'react';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import Container from '../components/Container';
import ContactLine from '../components/ContactLine';

const Body:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => (
  <Container>
    <ContactLine contact={campaign.ownerContact} />
  </Container>
);

const Footer:React.FC = () => null;

export default {
  Body,
  Footer,
};
