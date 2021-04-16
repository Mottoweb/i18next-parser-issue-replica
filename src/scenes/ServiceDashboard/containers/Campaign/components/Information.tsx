import React from 'react';
import { useTranslation } from 'react-i18next';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import { Section } from '@adnz/ui';
import SectionTitle from 'src/components/SectionTitle';
import { InfoContainer, InfoText } from './styles';

const Information:React.FC<{ campaign: CampaignDto }> = ({
  campaign,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <>
      <SectionTitle>{t('serviceDashboard:INFORMATION')}</SectionTitle>
      <InfoContainer>
        <Section id="campaign-information-container">
          <div>
            <b>
              {t('serviceDashboard:CAMPAIGN_INFORMATION')}
              :
            </b>
          </div>
          {!!campaign.description && (
            <div>
              <InfoText>{campaign.description}</InfoText>
            </div>
          )}
        </Section>
        <Section id="internal-information-container">
          <div>
            <b>
              {t('serviceDashboard:ADOPS_INFORMATION')}
              :
            </b>
          </div>
          {!!campaign.info && (
            <div>
              <InfoText>{campaign.info}</InfoText>
            </div>
          )}
        </Section>
      </InfoContainer>
    </>
  );
};

export default Information;
