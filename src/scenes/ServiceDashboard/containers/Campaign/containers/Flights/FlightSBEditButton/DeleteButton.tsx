import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icons, Table } from '@adnz/ui';
import { useRequest } from '@adnz/use-request';
import { CAMPAIGN_STAGES } from 'src/constants';
import { ActionType, CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import { CampaignDto, CampaignPositionDto, deleteCampaignPosition } from '@adnz/api-ws-salesforce';

export interface IDeleteButton {
  campaign: CampaignDto
  campaignPosition: CampaignPositionDto
}

const DeleteButton: React.FC<IDeleteButton> = ({
  campaign,
  campaignPosition,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { dispatch } = React.useContext(CampaignToolContext);

  const [, { pending }, deletePosition] = useRequest({
    apiMethod: deleteCampaignPosition,
    runOnMount: false,
    onSuccess: React.useCallback(
      (p, params) => {
        if (campaign && params) {
          const newCampaignPositions = campaign
            .campaignPositions.filter((cp) => cp.campaignPositionId !== params[0].campaignPositionId);
          dispatch({
            type: ActionType.SaveCampaign,
            payload: { ...campaign, campaignPositions: newCampaignPositions },
          });
        }
      },
      [campaign, dispatch],
    ),
  }, [campaign, dispatch]);

  const disabled = React.useMemo<boolean>(() => (
    ![CAMPAIGN_STAGES.DRAFT].includes(campaign.stage)
  ), [campaign]);

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    const { campaignPositionId } = campaignPosition;
    deletePosition({ campaignPositionId });
  }, [campaignPosition, deletePosition, disabled]);

  if (campaignPosition.deliveredImpressions && campaign.stage !== CAMPAIGN_STAGES.BOOKED) {
    return null;
  }

  return (
    <Table.ActionsListItem
      onClick={handleClick}
      isLoading={pending}
      disabled={disabled}
      icon={(<Icons.Trash />)}
      remove
      dataTestId="delete-position-button"
    >
      {t('serviceDashboard:DELETE')}
    </Table.ActionsListItem>
  );
};

export default DeleteButton;
