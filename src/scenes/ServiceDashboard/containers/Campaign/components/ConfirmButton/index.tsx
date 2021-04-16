import React, { useContext } from 'react';
import { useRequest } from '@adnz/use-request';
import { useTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CampaignForm, updateCampaignStage } from '@adnz/api-ws-salesforce';
import { Button } from '@adnz/ui';
import { CAMPAIGN_STAGES } from 'src/constants';
import notify from 'src/modules/Notification';
import confirmAlert from 'src/components/confirmAlert';
import { ActionType, CampaignToolContext } from '../../context';
import useVisible from './useVisible';

const Confirm:React.FC<{ className?:string } & RouteComponentProps<{ campaignId: string, type: string }>> = ({
  className = '',
  history,
  match: {
    params: {
      type,
      campaignId,
    },
  },
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { dispatch, state: { campaign } } = useContext(CampaignToolContext);
  const visible = useVisible(campaign);

  const redirectToPdfPreview = React.useCallback(
    () => history.push(`/buy-side/campaigns/${type}/${campaignId}/preview-pdf`),
    [type, campaignId, history],
  );

  const [, { pending: isLoading }, updateStage] = useRequest({
    apiMethod: updateCampaignStage,
    runOnMount: false,
    onSuccess: React.useCallback(
      (payload) => {
        if (!campaign?.hasPermission) {
          confirmAlert({
            title: t('serviceDashboard:CONFIRMATION'),
            body: () => t('serviceDashboard:CONFIRMATION_TEXT'),
            buttons: [{
              label: t('serviceDashboard:OK'),
              onClick: (close) => {
                close();

                if (!campaign?.campaignType.allowClientsToAcceptOffers && payload.stage === CAMPAIGN_STAGES.BOOKED) {
                  redirectToPdfPreview();
                }
              },
            }],
            withoutClose: true,
          });
        } else if (payload.stage === CAMPAIGN_STAGES.BOOKED) {
          redirectToPdfPreview();
        }

        dispatch({ type: ActionType.SaveCampaign, payload });
      },
      [campaign, t, dispatch, redirectToPdfPreview],
    ),
    onFail: React.useCallback(
      (error) => notify.warning('', t(error.response?.data.message)),
      [t],
    ),
  });

  const handleClick = React.useCallback(async () => {
    await updateStage(
      { stage: CAMPAIGN_STAGES.BOOKED } as CampaignForm,
      { campaignId: campaign?.campaignId ?? '' },
    );
  }, [campaign, updateStage]);

  if (!visible) {
    return null;
  }

  return (
    <Button
      id="accept-offer-button"
      className={className}
      theme="accept"
      onClick={handleClick}
      isLoading={isLoading}
    >
      {t('serviceDashboard:CONFIRM_OFFER')}
    </Button>
  );
};

export default withRouter(Confirm);
