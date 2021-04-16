import React from 'react';
import { useTranslation } from 'react-i18next';
import Colors from 'src/theme/Colors';
import { Tag } from '@adnz/ui';
import { AccountDto, CampaignDto, InvoiceState } from '@adnz/api-ws-salesforce';
import InvoiceLabel from 'src/scenes/ServiceDashboard/containers/Campaign/components/InvoiceLabel';
import AddressLine from '../components/AddressLine';
import Container from '../components/Container';

const Body:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => (
  <Container id="billing-field">
    <AddressLine account={campaign.payoutAccount as AccountDto} />
  </Container>
);

const Footer:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <Container>
      {campaign.invoiceState === InvoiceState.SPLIT && (
        <Tag value={t('serviceDashboard:SPLIT')} color={Colors['adnz-blue']} />
      )}
      {campaign.invoiceState !== InvoiceState.SPLIT && (
        <InvoiceLabel invoiceLabel={campaign.invoiceLabel ?? ''} />
      )}
    </Container>
  );
};

export default {
  Body,
  Footer,
};
