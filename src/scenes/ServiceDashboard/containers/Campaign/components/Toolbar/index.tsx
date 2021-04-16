import React, { useContext } from 'react';
import { CampaignForm, updateCampaignStage } from '@adnz/api-ws-salesforce';
import { useParams } from 'react-router';
import confirmAlert from 'src/components/confirmAlert';
import { Button } from '@adnz/ui';
import { useRequest } from '@adnz/use-request';
import { useTranslation } from 'react-i18next';
import { CAMPAIGN_STAGES } from 'src/constants';
import { ActionType, CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import notify from 'src/modules/Notification';
import ConfirmButton from '../ConfirmButton';
import DeclineButton from '../DeclineButton';
import CampaignActions from '../../containers/CampaignActions';
import ActivateButton from '../DetailsInfoBlock/components/ActivateButton';
import { ToolbarContainer } from './styles';

interface DetailsInfoBlockProps {
  isNotExternal: boolean,
}

const Toolbar:React.FC<DetailsInfoBlockProps> = ({
  isNotExternal,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { dispatch, state: { campaign } } = useContext(CampaignToolContext);
  const checkDeliveredItems = campaign
    && campaign.campaignPositions.map((position) => position.deliveredItems).some((c) => c && c > 0);
  const [, { pending: isStageUpdating }, updateStage] = useRequest({
    apiMethod: updateCampaignStage,
    runOnMount: false,
    onSuccess: React.useCallback(
      (payload) => {
        dispatch({ type: ActionType.SaveCampaign, payload });
      },
      [dispatch],
    ),
    onFail: React.useCallback(
      (error) => notify.warning('', t(error.response?.data.message)),
      [t],
    ),
  });
  const { type } = useParams<{ type: string }>();
  if (!campaign) return null;
  return (
    <>
      <ToolbarContainer>
        {
          campaign?.hasPermission && campaign.isSelfBookedBusinessclick && campaign.stage === CAMPAIGN_STAGES.DRAFT
          && (
            <>
              <ActivateButton type={type} campaign={campaign} isLoading={isStageUpdating} />
              <Button
                data-testid="archive-campaign-button"
                css="margin-right: 5px"
                theme="delete"
                isLoading={isStageUpdating}
                onClick={() => confirmAlert({
                  title: t('serviceDashboard:CONFIRM'),
                  message: t('serviceDashboard:ARCHIVE_CAMPAIGN_CONFIRMATION'),
                  buttons: [
                    {
                      label: t('serviceDashboard:YES_LABEL'),
                      onClick: (close) => {
                        updateStage(
                          { stage: CAMPAIGN_STAGES.ARCHIVED } as CampaignForm,
                          { campaignId: campaign.campaignId },
                        );
                        close();
                      },
                    },
                  ],
                  closeText: t('serviceDashboard:NO_LABEL'),
                })}
              >
                {t(campaign.isSelfBookedBusinessclick ? 'SB_ARCHIVE_BTN' : 'ARCHIVE_TAG')}
              </Button>
            </>
          )
        }
        {
          campaign?.hasPermission
          && campaign.isSelfBookedBusinessclick
          && campaign.stage === CAMPAIGN_STAGES.PENDING_APPROVAL
          && (
            <Button
              data-testid="deactivate-button"
              css="margin-right: 5px"
              theme="delete"
              isLoading={isStageUpdating}
              onClick={() => updateStage(
                { stage: CAMPAIGN_STAGES.DRAFT } as CampaignForm,
                { campaignId: campaign.campaignId, isCreditCardPayment: false },
              )}
            >
              {t('serviceDashboard:DEACTIVATE')}
            </Button>
          )
        }
        {
          campaign?.hasPermission
          && campaign.isSelfBookedBusinessclick
          && checkDeliveredItems && (
            <Button
              css="margin-right: 5px"
              theme="delete"
              isLoading={isStageUpdating}
              onClick={() => confirmAlert({
                title: t('serviceDashboard:CONFIRM'),
                message: t('serviceDashboard:ARCHIVE_CAMPAIGN_CONFIRMATION'),
                buttons: [
                  {
                    label: t('serviceDashboard:YES_LABEL'),
                    onClick: (close) => {
                      updateStage(
                        { stage: CAMPAIGN_STAGES.ARCHIVED } as CampaignForm,
                        { campaignId: campaign.campaignId },
                      );
                      close();
                    },
                  },
                ],
                closeText: t('serviceDashboard:NO_LABEL'),
              })}
            >
              {t(campaign.isSelfBookedBusinessclick ? 'SB_ARCHIVE_BTN' : 'ARCHIVE')}
            </Button>
          )
        }
        {isNotExternal && (
          <>
            {
              !campaign.isSelfBookedBusinessclick
              && <ConfirmButton css="margin-right: 5px" />
            }
            {
              !campaign.isSelfBookedBusinessclick
              && <DeclineButton css="margin-right: 5px" />
            }
            <CampaignActions campaign={campaign} />
          </>
        )}
      </ToolbarContainer>
    </>
  );
};

export default Toolbar;
