import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import notify from 'src/modules/Notification';
import { Icons, Table } from '@adnz/ui';
import { useRequest } from '@adnz/use-request';
import { CampaignDto, CampaignPositionDto, clonePosition } from '@adnz/api-ws-salesforce';
import { CAMPAIGN_STAGES } from 'src/constants';

export interface ICloneButton {
  type: string
  campaign: CampaignDto
  campaignPosition: CampaignPositionDto
}

const CloneButton: React.FC<ICloneButton> = ({
  type,
  campaign,
  campaignPosition,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();

  const [, { pending }, clone] = useRequest({
    apiMethod: clonePosition,
    runOnMount: false,
    onSuccess: React.useCallback(
      (p) => {
        history.push(`/buy-side/campaigns/${type}/sb/${campaign.campaignId}/position/${p.campaignPositionId}`);
      },
      [history, type, campaign],
    ),
    onFail: React.useCallback(
      ({ response }) => {
        notify.danger(t('serviceDashboard:ERROR'), t(response?.data.message));
      },
      [t],
    ),
  }, [type, campaign, history]);

  const disabled = React.useMemo<boolean>(() => (
    ![CAMPAIGN_STAGES.DRAFT].includes(campaign.stage)
  ), [campaign]);

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    const { campaignPositionId } = campaignPosition;
    clone({ campaignPositionId });
  }, [campaignPosition, disabled, clone]);

  if (campaign.stage === CAMPAIGN_STAGES.BOOKED) {
    return null;
  }

  return (
    <Table.ActionsListItem
      isLoading={pending}
      disabled={disabled}
      onClick={handleClick}
      icon={(<Icons.Copy />)}
      dataTestId="clone-positions-button"
    >
      <div>{t('serviceDashboard:CLONE')}</div>
    </Table.ActionsListItem>
  );
};

export default CloneButton;
