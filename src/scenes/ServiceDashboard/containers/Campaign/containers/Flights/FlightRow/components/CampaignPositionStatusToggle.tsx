import React, { useCallback } from 'react';
import { useRequest } from '@adnz/use-request';
import {
  activateLineItemByCampaignPositionId,
  deactivateLineItemByCampaignPositionId,
  LineItemStateDtoStateInline,
} from '@adnz/api-ws-salesforce';
import { useTranslation } from 'react-i18next';
import confirmAlert from 'src/components/confirmAlert';
import { useReloadCurrentCampaign } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import { Tag } from '@adnz/ui';
import Colors from 'src/theme/Colors';

type CampaignPositionStatusToggleProps = {
  campaignPositionId: string;
  status?: LineItemStateDtoStateInline
};

export const CampaignPositionStatusToggle: React.FC<CampaignPositionStatusToggleProps> = (
  { status, campaignPositionId },
) => {
  const { t } = useTranslation(['translation', 'common', 'serviceDashboard']);

  const reloadCurrentCampaign = useReloadCurrentCampaign();

  const [,, requestDeactivation] = useRequest({
    apiMethod: deactivateLineItemByCampaignPositionId,
    runOnMount: false,
    onSuccess: reloadCurrentCampaign,
  });

  const [,, requestActivation] = useRequest({
    apiMethod: activateLineItemByCampaignPositionId,
    parameters: [{ campaignPositionId }],
    runOnMount: false,
    onSuccess: reloadCurrentCampaign,
  });

  const confirmEnablePosition = useCallback(() => confirmAlert({
    title: t('serviceDashboard:ENABLE_CAMPAIGN_POSITION'),
    message: t('serviceDashboard:ENABLE_CAMPAIGN_POSITION_CONFIRMATION'),
    buttons: [
      {
        label: t('serviceDashboard:BUTTON_CONFIRM'),
        onClick: (close) => {
          requestActivation({ campaignPositionId });
          close();
        },
      },
    ],
    closeText: t('serviceDashboard:BUTTON_CANCEL'),
  }),
  [requestActivation, campaignPositionId, t]);

  const confirmDisablePosition = useCallback(() => confirmAlert({
    title: t('serviceDashboard:DISABLE_CAMPAIGN_POSITION'),
    message: t('serviceDashboard:DISABLE_CAMPAIGN_POSITION_CONFIRMATION'),
    buttons: [
      {
        label: t('serviceDashboard:BUTTON_CONFIRM'),
        onClick: (close) => {
          requestDeactivation({ campaignPositionId });
          close();
        },
      },
    ],
    closeText: t('serviceDashboard:BUTTON_CANCEL'),
  }), [requestDeactivation, t, campaignPositionId]);

  if (status === LineItemStateDtoStateInline.ACTIVE) {
    return (
      <span onClick={confirmDisablePosition}>
        <Tag
          value={t('serviceDashboard:ACTIVE')}
          color={Colors['adnz-green']}
        />
      </span>
    );
  } if (status === LineItemStateDtoStateInline.INACTIVE) {
    return (
      <span onClick={confirmEnablePosition}>
        <Tag
          value={t('serviceDashboard:INACTIVE')}
          color={Colors['adnz-danger']}
        />
      </span>
    );
  }
  return null;
};
