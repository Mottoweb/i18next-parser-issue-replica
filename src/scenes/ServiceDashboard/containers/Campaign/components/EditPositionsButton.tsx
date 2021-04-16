import React from 'react';
import { Button } from '@adnz/ui';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CampaignDto, CampaignPositionType } from '@adnz/api-ws-salesforce';
import { useTranslation } from 'react-i18next';
import confirmAlert from 'src/components/confirmAlert';
import { CAMPAIGN_STAGES } from 'src/constants';

const invoiceLabelToRedirect = [undefined, null, 'OPEN', 'HIDDEN', 'NONE', 'SPLIT'];

interface EditPositionsButtonProps extends RouteComponentProps<{ type: string }>{
  campaign: CampaignDto,
  positionType: CampaignPositionType,
}

const EditPositionsButton:React.FC<EditPositionsButtonProps> = ({
  positionType,
  campaign,
  history,
  match: {
    params: {
      type,
    },
  },
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const showConfirmationToPositions = !invoiceLabelToRedirect.includes(campaign.invoiceLabel);
  const redirectToEdit = React.useCallback(
    () => {
      history.push(`/buy-side/campaigns/${type}/${campaign.campaignId}/edit-positions/${positionType}`);
    },
    [history, type, campaign.campaignId, positionType],
  );
  const confirmation = React.useCallback(
    () => confirmAlert({
      title: t('serviceDashboard:CONFIRM'),
      message: t('serviceDashboard:WARN_MESSAGE'),
      buttons: [
        {
          label: t('serviceDashboard:PROCEED'),
          onClick: (close) => {
            redirectToEdit();
            close();
          },
        },
      ],
      closeText: t('serviceDashboard:BACK'),
    }),
    [t, redirectToEdit],
  );

  const disabled = React.useMemo<boolean>(() => (
    campaign.isSelfBookedBusinessclick
    && ![
      CAMPAIGN_STAGES.DRAFT,
      CAMPAIGN_STAGES.PENDING_APPROVAL,
    ].includes(campaign.stage)
  ), [campaign.isSelfBookedBusinessclick, campaign.stage]);

  const handleClick = React.useCallback(() => {
    if (disabled) {
      return undefined;
    }

    return showConfirmationToPositions ? confirmation() : redirectToEdit();
  }, [showConfirmationToPositions, confirmation, redirectToEdit, disabled]);

  return (
    <Button
      id="edit-positions-button"
      theme="edit"
      onClick={handleClick}
      disabled={disabled}
    >
      <span>{t('serviceDashboard:EDIT_POSITIONS')}</span>
    </Button>
  );
};

export default withRouter(EditPositionsButton);
