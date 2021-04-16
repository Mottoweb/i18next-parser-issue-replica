import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icons, Table } from '@adnz/ui';
import { CampaignDto, CampaignPositionDto } from '@adnz/api-ws-salesforce';
import { CAMPAIGN_STAGES } from 'src/constants';
import { useIdentityRoles } from '@adnz/use-auth';

export interface IEditButton {
  type: string
  campaign: CampaignDto
  campaignPosition: CampaignPositionDto
}

const EditButton: React.FC<IEditButton> = ({
  type,
  campaign,
  campaignPosition,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const { SELF_BOOKING } = useIdentityRoles();

  const disabled = React.useMemo<boolean>(() => ![
    CAMPAIGN_STAGES.DRAFT,
    CAMPAIGN_STAGES.BOOKED,
    CAMPAIGN_STAGES.PERFORMANCE,
  ].includes(campaign.stage), [campaign]) || !SELF_BOOKING;

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    history.push(
      `/buy-side/campaigns/${type}/sb/${campaign.campaignId}/position/${campaignPosition.campaignPositionId}`,
    );
  }, [history, type, campaign, campaignPosition, disabled]);

  return (
    <Table.ActionsListItem
      onClick={handleClick}
      disabled={disabled}
      icon={(<Icons.Edit />)}
      dataTestId="edit-position-button"
    >
      <div>{t('serviceDashboard:EDIT')}</div>
    </Table.ActionsListItem>
  );
};

export default EditButton;
