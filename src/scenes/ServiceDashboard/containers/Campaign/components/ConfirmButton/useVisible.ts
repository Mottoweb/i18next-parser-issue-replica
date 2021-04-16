import { useMemo } from 'react';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import { CAMPAIGN_STAGES } from 'src/constants';

export default (campaign?: CampaignDto): boolean => useMemo<boolean>(() => {
  if (!campaign) {
    return false;
  }

  if (!(campaign.stage === CAMPAIGN_STAGES.OFFERED || campaign.stage === CAMPAIGN_STAGES.ALTERNATE_QUOTE)) {
    return false;
  }

  if (campaign.hasPermission) {
    return true;
  }

  if (campaign.isSelfBookedBusinessclick) {
    return false;
  }

  return campaign.campaignType.allowClientsToAcceptOffers;
}, [campaign]);
