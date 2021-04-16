import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@adnz/ui';
import { CampaignDto } from '@adnz/api-ws-salesforce';

export interface IActivateButton {
  type: string
  campaign: CampaignDto
  isLoading?: boolean
}

const ActivateButton: React.FC<IActivateButton> = ({
  type,
  campaign,
  isLoading = false,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();

  const disabled = React.useMemo(() => campaign.campaignPositions.length === 0, [campaign]);

  const handleClick = React.useCallback(() => {
    if (disabled === false) {
      history.push(`/buy-side/campaigns/${type}/${campaign.campaignId}/payment`);
    }
  }, [history, campaign, disabled, type]);

  return (
    <Button
      data-testid="activate-campaign-button"
      css="margin-right: 5px"
      theme="accept"
      isLoading={isLoading}
      onClick={handleClick}
      disabled={disabled}
    >
      {t(campaign.isSelfBookedBusinessclick ? 'SB_ACTIVATE_BTN' : 'ACTIVATE')}
    </Button>
  );
};

export default ActivateButton;
