import React, { useCallback, useContext } from 'react';
import { createGlobalStyle } from 'styled-components';
import {
  Container,
} from 'styled-bootstrap-grid';
import { Loader } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import { CampaignPositionType, findByCampaignIdCheckRole } from '@adnz/api-ws-salesforce';
import SectionTitle from 'src/components/SectionTitle';
import CampaignChartContainer from 'src/components/CampaignChartContainer';
import { checkPaymentsSucceeded } from '@adnz/api-ws-credit-card';
import { useCampaignViewabilityIsShown } from 'src/scenes/ServiceDashboard/containers/Campaign/hooks';
import SearchFilter from 'src/scenes/ServiceDashboard/containers/SearchFilter';
import CampaignChart from './containers/CampaignChart';
import Screenshots from './containers/Screenshots';
import Comments from './containers/Comments';
import TechnicalActivities from './containers/TechnicalActivities';
import Documents from './containers/Documents';
import Flights from './containers/Flights';
import PrintPositions from './containers/PrintPositions';
import EditPositionsButton from './components/EditPositionsButton';
import Information from './components/Information';
import CampaignRow from './components/CampaignRow';
import DetailsInfoBlock from './components/DetailsInfoBlock';
import { TitleContainer } from './components/TitleContainer';
import CreatePositionButton from './components/CreatePositionButton';
import { ActionType, CampaignToolContext, CampaignReloadContext } from './context';
import Toolbar from './components/Toolbar';
import StatusFilter, { StatusFilterEntity } from '../StatusFilter';

export const HideToTopButtonStyles = createGlobalStyle`
  footer + [class*="Arrow"] {
    display: none;
  }
`;

const Campaign:React.FC<{ campaignId: string, type: string }> = ({
  campaignId,
  type,
}) => {
  const { dispatch, state: { campaign } } = useContext(CampaignToolContext);
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [isPaymentSucceeded] = useRequest({
    apiMethod: checkPaymentsSucceeded,
    runOnMount: true,
    parameters: [{
      campaignId,
    }],
  });

  const isViewabilityShown = useCampaignViewabilityIsShown();

  const [, { pending: isLoading }, loadCampaign] = useRequest({
    apiMethod: findByCampaignIdCheckRole,
    parameters: [{ campaignId }],
    onSuccess: React.useCallback(
      (payload) => dispatch({ type: ActionType.SaveCampaign, payload }),
      [dispatch],
    ),
  });

  const reloadCurrentCampaign = useCallback(() => loadCampaign({ campaignId }), [loadCampaign, campaignId]);

  if (isLoading || !campaign) return <Loader />;

  const { campaignType } = campaign;
  const amountHasData = campaign.campaignPositions.length
    && campaign.campaignPositions.some((cp) => cp.showAmount !== false);

  const isNotExternal = !(!!campaignType && campaignType.externalOrder === true);
  const showEditPositionsButton = !!(campaign.hasPermission && isNotExternal && !campaign.isSelfBookedBusinessclick);

  return (
    <CampaignReloadContext.Provider value={reloadCurrentCampaign}>
      <HideToTopButtonStyles />
      <StatusFilter
        entity={StatusFilterEntity.CAMPAIGNS}
        filters={(
          <SearchFilter type="campaigns" />
        )}
      />
      <div>
        <div>
          <DetailsInfoBlock isPaymentSucceeded={isPaymentSucceeded} />
          <div className="campaign-page">
            <Container>
              <SectionTitle withToolbar>
                {t('serviceDashboard:STATISTICS')}
                <Toolbar isNotExternal={isNotExternal} />
              </SectionTitle>
              <div className="graph-box table-container-mobile">
                <div className="table-responsive table-responsive_fix-lg" id="statistics-block">
                  <table className="single-flight single-flight-table table dash-tbody-table dash-tbody-table_mrg0">
                    <thead>
                      <tr>
                        <th />
                        <th>{t('serviceDashboard:CAMPAIGN')}</th>
                        <th>{t('serviceDashboard:ADVERTISER')}</th>
                        <th>{t('serviceDashboard:START_DATE')}</th>
                        <th>{t('serviceDashboard:END_DATE')}</th>
                        <th className="text-center">{t('serviceDashboard:DELIVERY_INDICATOR')}</th>
                        <th className="text-center">{t('serviceDashboard:CTR')}</th>
                        {isViewabilityShown && <th className="text-center">{t('serviceDashboard:VISIBILITY')}</th>}
                        {!campaign.selfBooked && <th>{t('serviceDashboard:AMOUNT_NET2')}</th>}
                        {campaign.selfBooked && <th />}
                      </tr>
                    </thead>
                    <CampaignRow
                      amountHasData
                      type="all"
                      className="hover single-flight-row"
                    />
                  </table>
                </div>
              </div>
              <CampaignChartContainer>
                <CampaignChart
                  campaignId={campaign.campaignId}
                />
              </CampaignChartContainer>
              <div css="display: flex;justify-content: space-between;align-items: center;">
                <TitleContainer>
                  <SectionTitle>{t('serviceDashboard:DIGITAL_POSITIONS')}</SectionTitle>
                </TitleContainer>
                <CreatePositionButton type={type} campaign={campaign} isNotExternal={isNotExternal} />
                <PrivateRoute
                  roles={Roles.BOOK_CAMPAIGNS}
                  render={() => (
                    <div className="default-btn-group default-btn-group_aic default-btn-group_right">
                      {campaign.hasPermission && isNotExternal && !campaign.isSelfBookedBusinessclick && (
                        <EditPositionsButton campaign={campaign} positionType={CampaignPositionType.DIGITAL} />
                      )}
                    </div>
                  )}
                />
              </div>
              <div>
                <Flights
                  amountHasData={!!amountHasData}
                  type={type}
                  isPaymentSucceeded={isPaymentSucceeded}
                />
              </div>
              <PrintPositions
                campaign={campaign}
                type={type}
                showEditButton={showEditPositionsButton}
              />
              {
                campaign.hasPermission
                && (campaign.description || campaign.info)
                && <Information campaign={campaign} />
              }
              <Comments campaignId={campaign.campaignId} />
              <TechnicalActivities campaign={campaign} />
              <Screenshots campaignId={campaign.campaignId} />
              <Documents campaign={campaign} isAdmin />
            </Container>
          </div>
        </div>
      </div>
    </CampaignReloadContext.Provider>
  );
};

export default React.memo(Campaign);
