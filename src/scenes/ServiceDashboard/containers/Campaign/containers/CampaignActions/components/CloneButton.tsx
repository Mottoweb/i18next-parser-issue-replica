import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { DropdownList } from '@adnz/ui';
import notify from 'src/modules/Notification';
import { useRequest } from '@adnz/use-request';
import { CampaignDto, cloneCampaign } from '@adnz/api-ws-salesforce';
import { CAMPAIGN_STAGES } from 'src/constants';

export interface ICloneButton {
  campaign: CampaignDto
}

const CloneButton: React.FC<ICloneButton> = ({
  campaign,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const { type } = useParams<{ type: string }>();

  const [, { pending: isCloning }, clone] = useRequest({
    apiMethod: cloneCampaign,
    runOnMount: false,
    onSuccess: React.useCallback(
      (data) => {
        history.push(`/buy-side/campaigns/${type}/${data.campaignId}`);
      },
      [history, type],
    ),
    onFail: React.useCallback(
      ({ response }) => notify.danger(t('serviceDashboard:ERROR'), t(response?.data.message)),
      [t],
    ),
  }, [history]);

  const handleClick = React.useCallback(() => clone({
    campaignId: campaign.campaignId,
    stage: campaign.isSelfBookedBusinessclick ? CAMPAIGN_STAGES.DRAFT : CAMPAIGN_STAGES.OFFERED,
  }), [campaign, clone]);

  return (
    <DropdownList.Item
      id="clone-dropdown-item"
      isLoading={isCloning}
      onClick={handleClick}
    >
      {t('serviceDashboard:CLONE')}
    </DropdownList.Item>
  );
};

export default CloneButton;
