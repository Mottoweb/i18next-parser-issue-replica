import { useContext, useMemo } from 'react';
import { CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import { CampaignDto } from '@adnz/api-ws-salesforce';

const useCampaign = (): CampaignDto | undefined => {
  const {
    state: { campaign },
  } = useContext(CampaignToolContext);
  return campaign;
};

export const useCampaignViewabilityIsShown = (): boolean => {
  const campaign = useCampaign();
  return useMemo(() => {
    if (campaign) {
      if (campaign.hasPermission) {
        return true;
      }
      return campaign.campaignPositions.some(
        (campaignPosition) => campaignPosition.adType.userVisibilityEnabled,
      );
    }
    return false;
  }, [campaign]);
};

export const useCampaignPositionViewabilityIsShown = (
  campaignPositionId: string,
): boolean => {
  const campaign = useCampaign();
  return useMemo(() => {
    if (campaign) {
      if (campaign.hasPermission) {
        return true;
      }
      const position = campaign.campaignPositions.find(
        (campaignPosition) => campaignPosition.campaignPositionId === campaignPositionId,
      );
      return Boolean(position?.adType.userVisibilityEnabled);
    }
    return false;
  }, [campaign, campaignPositionId]);
};
