import React, { useCallback } from 'react';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import { useTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import confirmAlert from 'src/components/confirmAlert';
import { Button } from '@adnz/ui';
import { CAMPAIGN_STAGES } from 'src/constants';

const invoiceLabelToRedirect = [undefined, null, 'OPEN', 'HIDDEN', 'NONE', 'SPLIT'];

interface EditButtonProps extends RouteComponentProps<{ type: string }>{
  campaign: CampaignDto,
}

const EditButton:React.FC<EditButtonProps> = ({
  campaign,
  history,
  match: {
    params: {
      type,
    },
  },
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { invoiceLabel } = campaign;
  const showConfirmationToEditPage = !invoiceLabelToRedirect.includes(invoiceLabel);
  const redirectToEdit = useCallback(() => {
    if (campaign.isSelfBookedBusinessclick) {
      history.push(`/buy-side/campaigns/${type}/sb/${campaign.campaignId}`);
    } else {
      history.push(`/buy-side/campaigns/${type}/${campaign.campaignId}/edit`);
    }
  }, [campaign, history, type]);
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
    && ![CAMPAIGN_STAGES.DRAFT].includes(campaign.stage)
  ), [campaign]);

  const visible = React.useMemo<boolean>(
    () => campaign.stage !== CAMPAIGN_STAGES.ARCHIVED || !campaign.hasPermission,
    [campaign],
  );

  const handleClick = React.useCallback(() => {
    if (disabled) {
      return undefined;
    }

    return showConfirmationToEditPage ? confirmation() : redirectToEdit();
  }, [showConfirmationToEditPage, redirectToEdit, confirmation, disabled]);

  if (!visible) {
    return null;
  }

  return (
    <Button
      data-testid="edit-campaign-button"
      theme="edit"
      onClick={handleClick}
      disabled={disabled}
    >
      {t('serviceDashboard:EDIT_CAMPAIGN_BUTTON')}
    </Button>
  );
};

export default withRouter(EditButton);
