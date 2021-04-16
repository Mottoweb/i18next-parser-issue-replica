import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Loader } from '@adnz/ui';
import UpperMenu from 'src/scenes/ServiceDashboard/UpperMenu';
import PreviewPage from 'src/scenes/SelfBookingTool/scenes/PreviewPage';
import CampaignPage from 'src/scenes/SelfBookingTool/scenes/CampaignPage';
import PositionPage from 'src/scenes/SelfBookingTool/scenes/PositionPage';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';
import CampaignOwnerRoute from 'src/components/CampaignOwnerRoute';
import { FILTER_TYPES } from 'src/modules/CampaignFilters/context';
import { CAMPAIGN_TYPES } from 'src/constants';
import { CreditCardsProvider } from 'src/scenes/Account/containers/Company/containers/CreditCards/context';
import { CampaignToolProvider } from 'src/scenes/ServiceDashboard/containers/Campaign/context';

import { CampaignPositionType } from '@adnz/api-ws-salesforce';
import SearchFilter from '../containers/SearchFilter';

const Campaigns = React.lazy(() => import('src/scenes/Campaigns'));
const CampaignEdit = React.lazy(() => import('src/scenes/BookingTool/containers/CampaignEdit'));
const NotFoundScene = React.lazy(() => import('src/scenes/NotFound'));
const CampaignFilters = React.lazy(() => import('src/modules/CampaignFilters'));
const CampaignPreview = React.lazy(() => import('src/scenes/BookingTool/containers/CampaignPreview'));
const CampaignPositionsEdit = React.lazy(() => import('src/scenes/BookingTool/containers/CampaignPositionsEdit'));

const History = React.lazy(() => import('../containers/History'));
const Campaign = React.lazy(() => import('../containers/Campaign'));
const PaymentDetails = React.lazy(() => import('../containers/PaymentDetails'));
const SelfBookingHistory = React.lazy(() => import('../containers/SelfBookingHistory'));

const CampaignsRoutes: React.FC = () => (
  <React.Suspense fallback={<Loader />}>
    <PrivateSwitch>
      <PrivateRoute
        exact
        roles={Roles.AGENCY}
        noRoles={Roles.BOOK_CAMPAIGNS}
        path="(/buy-side|/buy-side/campaigns)"
        render={() => (
          <Redirect to="/buy-side/campaigns/ALL" />
        )}
      />
      <PrivateRoute
        exact
        roles={Roles.AGENCY}
        path="(/buy-side|/buy-side/campaigns)"
        render={() => (
          <Redirect to="/buy-side/campaigns/RUNNING" />
        )}
      />
      <PrivateRoute
        roles={[Roles.ADMIN, Roles.BOOK_CAMPAIGNS]}
        path="/buy-side/campaigns/OFFERED/new-order/:accountId"
        render={({ match: { params: { accountId } } }) => (
          <CampaignEdit
            type="OFFERED"
            accountId={accountId}
          />
        )}
      />
      <PrivateRoute
        roles={[Roles.ADMIN, Roles.BOOK_CAMPAIGNS]}
        path="/buy-side/campaigns/OFFERED/tasks/:taskId/new-order"
        render={({ match: { params: { taskId } } }) => (
          <CampaignEdit
            type="OFFERED"
            taskId={taskId}
          />
        )}
      />
      <PrivateRoute
        roles={[Roles.ADMIN, Roles.BOOK_CAMPAIGNS]}
        path="/buy-side/campaigns/OFFERED/new-order"
        render={() => (
          <CampaignEdit type="OFFERED" />
        )}
      />
      <CampaignOwnerRoute
        identifier="campaignId"
        roles={[Roles.ADMIN, Roles.BOOK_CAMPAIGNS]}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/:campaignId/edit`}
        render={({ match: { params: { type, campaignId } } }) => {
          if (type) {
            return (
              <CampaignEdit
                type={type}
                campaignId={campaignId}
              />
            );
          }
          return null;
        }}
      />
      <PrivateRoute
        key="sb_create_campaign"
        roles={[Roles.ADMIN, Roles.SELF_BOOKING]}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/sb/new-order/campaign`}
        render={() => (
          <CampaignPage />
        )}
      />
      <PrivateRoute
        key="sb_edit_campaign"
        roles={[Roles.ADMIN, Roles.SELF_BOOKING]}
        exact
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/sb/:campaignId(\\d+)/`}
        render={() => (
          <CampaignPage />
        )}
      />
      <PrivateRoute
        key="sb_create_position"
        roles={[Roles.ADMIN, Roles.SELF_BOOKING]}
        exact
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/sb/:campaignId(\\d+)/position/create`}
        render={() => (
          <PositionPage />
        )}
      />
      <PrivateRoute
        key="sb_edit_position"
        roles={[Roles.ADMIN, Roles.SELF_BOOKING]}
        exact
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/sb/:campaignId(\\d+)/position/:positionId(\\d+)`}
        render={() => (
          <PositionPage />
        )}
      />
      <PrivateRoute
        key="sb_preview_page"
        roles={[Roles.ADMIN, Roles.SELF_BOOKING]}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/sb/:campaignId(\\d+)/preview-pdf`}
        render={() => (
          <PreviewPage />
        )}
      />
      <CampaignOwnerRoute
        identifier="campaignId"
        roles={[Roles.ADMIN, Roles.BOOK_CAMPAIGNS]}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/:campaignId(\\d+)/edit-positions/:dtp?`}
        render={({ match }) => {
          if (match.params.campaignId) {
            return (
              <CampaignPositionsEdit
                type={match.params.type || 'ALL'}
                campaignId={match.params.campaignId}
                demandedPositionType={match.params.dtp as CampaignPositionType}
              />
            );
          }
          return null;
        }}
      />
      <PrivateRoute
        roles={[Roles.ADMIN, Roles.BOOK_CAMPAIGNS]}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/:campaignId(\\d+)/history`}
        render={({ match }) => (
          <History
            campaignId={match.params.campaignId}
            renderUpperMenu={() => <UpperMenu />}
          />
        )}
      />
      <Route
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/:campaignId(\\d+)/sb-history`}
        render={({ match }) => {
          if (match.params.campaignId) {
            return (
              <SelfBookingHistory
                campaignId={match.params.campaignId}
                renderUpperMenu={() => <UpperMenu />}
              />
            );
          }
          return null;
        }}
      />
      <PrivateRoute
        roles={[Roles.ADMIN, Roles.BOOK_CAMPAIGNS]}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/:campaignId(\\d+)/preview-pdf`}
        render={({ match }) => {
          if (match.params.campaignId) {
            return (
              <CampaignPreview
                type={match.params.type || 'ALL'}
                campaignId={match.params.campaignId}
              />
            );
          }
          return null;
        }}
      />
      <PrivateRoute
        roles={Roles.AGENCY}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/:campaignId(\\d+)/payment`}
        render={() => (
          <CampaignToolProvider>
            <CreditCardsProvider>
              <PaymentDetails renderUpperMenu={() => <UpperMenu />} />
            </CreditCardsProvider>
          </CampaignToolProvider>
        )}
      />
      <PrivateRoute
        roles={Roles.AGENCY}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/:campaignId(\\d+)`}
        render={({ match }) => {
          if (match.params.campaignId) {
            return (
              <CampaignToolProvider>
                <Campaign
                  type={match.params.type || 'ALL'}
                  campaignId={match.params.campaignId}
                />
              </CampaignToolProvider>
            );
          }
          return null;
        }}
      />
      <PrivateRoute
        roles={Roles.AGENCY}
        path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})`}
        render={() => (
          <Campaigns
            searchFilter={() => (
              <SearchFilter type="campaigns" />
            )}
            renderFilter={() => (
              <CampaignFilters
                allowedOptions={[
                  FILTER_TYPES.ACCOUNT,
                  FILTER_TYPES.SALES,
                  FILTER_TYPES.ADVERTISER,
                  FILTER_TYPES.STAGE,
                  FILTER_TYPES.CAMPAIGN_TYPE,
                  FILTER_TYPES.INDUSTRY,
                  FILTER_TYPES.CREATED_BY,
                  FILTER_TYPES.END_DATE,
                  FILTER_TYPES.START_DATE,
                ]}
              />
            )}
          />
        )}
      />
      <PrivateRoute
        exact
        path="/buy-side"
        roles={Roles.AGENCY}
        render={() => <Redirect to="/buy-side/campaigns" />}
      />
      <PrivateRoute
        path="/buy-side/campaigns"
        roles={Roles.AGENCY}
        component={NotFoundScene}
      />
    </PrivateSwitch>
  </React.Suspense>
);

export default CampaignsRoutes;
