import React, { useContext, useRef } from 'react';
import { CampaignForm, updateCampaignStage } from '@adnz/api-ws-salesforce';
import { Button, Textarea } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import confirmAlert from 'src/components/confirmAlert';
import { CAMPAIGN_STAGES } from 'src/constants';
import { useRequest } from '@adnz/use-request';
import { ActionType, CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import notify from 'src/modules/Notification';
import useVisible from './useVisible';

const Decline:React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { dispatch, state: { campaign } } = useContext(CampaignToolContext);
  const visible = useVisible(campaign);
  const ref = useRef<null|HTMLTextAreaElement>(null);

  const [, { pending: isLoading }, updateStage] = useRequest({
    apiMethod: updateCampaignStage,
    runOnMount: false,
    onSuccess: React.useCallback(
      (payload) => {
        if (!campaign?.hasPermission && campaign?.campaignType.allowClientsToRejectOffers) {
          confirmAlert({
            title: t('serviceDashboard:DECLINED'),
            body: () => t('serviceDashboard:DECLINE_TEXT'),
            buttons: [{
              label: t('serviceDashboard:OK'),
              onClick: (close) => close(),
            }],
            withoutClose: true,
          });
        }

        dispatch({ type: ActionType.SaveCampaign, payload });
      },
      [campaign, t, dispatch],
    ),
    onFail: React.useCallback(
      (error) => notify.warning('', t(error.response?.data.message)),
      [t],
    ),
  });

  const reasonAlert = React.useCallback(() => confirmAlert({
    title: t('serviceDashboard:REASON_FOR_REFUSAL'),
    body: () => <Textarea ref={ref} rows={5} />,
    buttons: [
      {
        label: t('serviceDashboard:CONFIRM'),
        onClick: (close) => {
          updateStage(
            {
              stage: CAMPAIGN_STAGES.OFFER_DENIED,
              reasonForRefusal: ref.current && ref.current.value,
            } as CampaignForm,
            { campaignId: campaign?.campaignId ?? '' },
          );
          close();
        },
      },
    ],
    closeText: t('serviceDashboard:CANCEL'),
  }), [t, campaign, updateStage]);

  const handleClick = React.useCallback(async () => {
    if (campaign?.hasPermission) {
      reasonAlert();
    } else {
      await updateStage(
        { stage: CAMPAIGN_STAGES.OFFER_DENIED } as CampaignForm,
        { campaignId: campaign?.campaignId ?? '' },
      );
    }
  }, [campaign, reasonAlert, updateStage]);

  if (!visible) {
    return null;
  }

  return (
    <Button
      id="decline-offer-button"
      className={className}
      isLoading={isLoading}
      theme="delete"
      onClick={handleClick}
    >
      {t('serviceDashboard:DECLINE_OFFER')}
    </Button>
  );
};

export default Decline;
