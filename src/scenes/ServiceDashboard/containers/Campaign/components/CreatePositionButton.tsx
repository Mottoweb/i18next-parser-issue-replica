import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Icons } from '@adnz/ui';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import { CAMPAIGN_STAGES, CAMPAIGN_TYPE_PR, CAMPAIGN_INVOICE_STATE_CHARGED } from 'src/constants';

export interface ICreatePositionButton {
  type: string,
  campaign: CampaignDto,
  isNotExternal: boolean,
}

const CreatePositionButton: React.FC<ICreatePositionButton> = ({
  type,
  campaign,
  isNotExternal,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();

  const isEditable = React.useMemo<boolean>(() => !(
    !campaign.campaignType
    || campaign.campaignType.name === CAMPAIGN_TYPE_PR
    || campaign.invoiceState === CAMPAIGN_INVOICE_STATE_CHARGED
  ), [campaign]);

  const displayButton = React.useMemo<boolean>(() => (
    !!campaign?.hasPermission
    && campaign.stage !== CAMPAIGN_STAGES.BOOKED
    && isEditable
    && isNotExternal
  ), [campaign, isEditable, isNotExternal]);

  const disabled = React.useMemo<boolean>(
    () => (
      campaign.isSelfBookedBusinessclick
      && ![CAMPAIGN_STAGES.DRAFT].includes(campaign.stage)
    ),
    [campaign],
  );

  const visible = React.useMemo<boolean>(
    () => {
      if (!campaign.hasPermission) {
        return false;
      }

      return campaign.isSelfBookedBusinessclick && (campaign.stage !== CAMPAIGN_STAGES.ARCHIVED || !displayButton);
    },
    [campaign, displayButton],
  );

  const handleClick = React.useCallback(() => {
    if (disabled) {
      return undefined;
    }

    return history.push(`/buy-side/campaigns/${type}/sb/${campaign.campaignId}/position/create`);
  }, [type, campaign, history, disabled]);

  if (!visible) {
    return null;
  }

  return (
    <div style={{ marginRight: 10 }}>
      <Button
        data-testid="create-positon-button"
        disabled={disabled}
        onClick={handleClick}
        theme="edit"
      >
        <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
          <Icons.PlusCircle
            color="#fff"
            size={16}
            css="margin-right: 3px;"
          />
          <span>{t('serviceDashboard:CREATE_POSITION')}</span>
        </div>
      </Button>
    </div>
  );
};

export default CreatePositionButton;
