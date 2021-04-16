import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icons, Table } from '@adnz/ui';
import { useRequest } from '@adnz/use-request';
import { CampaignDto, CampaignPositionDto, updateCampaignPositionActiveState } from '@adnz/api-ws-salesforce';
import { ActionType, CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import { CAMPAIGN_STAGES } from 'src/constants';
import { useIdentityRoles } from '@adnz/use-auth';

export interface IToggleActivationButton {
  campaign: CampaignDto
  campaignPosition: CampaignPositionDto
}

const ToggleActivationButton: React.FC<IToggleActivationButton> = ({
  campaign,
  campaignPosition,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { dispatch } = React.useContext(CampaignToolContext);
  const { SELF_BOOKING } = useIdentityRoles();

  const [, { pending }, toggle] = useRequest({
    apiMethod: updateCampaignPositionActiveState,
    runOnMount: false,
    onSuccess: React.useCallback(
      (p, params) => {
        if (campaign && params) {
          const newCampaignPositions = campaign
            .campaignPositions.map((cp) => (cp.campaignPositionId === params[0].campaignPositionId ? p : cp));
          dispatch({
            type: ActionType.SaveCampaign,
            payload: { ...campaign, campaignPositions: newCampaignPositions },
          });
        }
      },
      [campaign, dispatch],
    ),
  }, [campaign, dispatch]);

  const disabled = React.useMemo<boolean>(() => ![
    CAMPAIGN_STAGES.DRAFT,
    CAMPAIGN_STAGES.PENDING_APPROVAL,
    CAMPAIGN_STAGES.BOOKED,
    CAMPAIGN_STAGES.PERFORMANCE,
  ].includes(campaign.stage), [campaign]) || !SELF_BOOKING;

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    const {
      isActive,
      campaignPositionId,
    } = campaignPosition;

    toggle({ isActive: !isActive, campaignPositionId });
  }, [campaignPosition, disabled, toggle]);

  return (
    <Table.ActionsListItem
      onClick={handleClick}
      isLoading={pending}
      disabled={disabled}
      icon={campaignPosition.isActive
        ? <Icons.Cross color="#fff" size={17} /> : <Icons.Checkmark color="#fff" size={17} />}
      dataTestId="deactivate-activate-button"
    >
      <div>{campaignPosition.isActive ? t('serviceDashboard:DEACTIVATE') : t('serviceDashboard:ACTIVATE')}</div>
    </Table.ActionsListItem>
  );
};

export default ToggleActivationButton;
