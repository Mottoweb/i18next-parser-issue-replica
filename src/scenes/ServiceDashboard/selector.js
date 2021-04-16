import {
  Map,
} from 'immutable';
import {
  createSelector,
} from 'reselect';
import createCachedSelector from 're-reselect';
import {
  getItemId,
  getServiceDashboardRoot as getRoot,
  getCampaign,
  getAccountShort,
  getCampaignEntity,
  getRoot as getState,
  getRefs,
} from 'src/selectors';

export const isCloning = createSelector(
  getRoot,
  (state) => state.get('cloning', false),
);

export const getCompanySelectRoot = createSelector(
  getRoot,
  (state) => state.get('companySelect', new Map()),
);

export const getPixelPoints = createSelector(
  getRoot,
  (state) => state.get('pixelPoints', new Map()),
);

export const getCampaignPositionsRoot = createSelector(
  getRoot,
  (state) => state.get('campaignPositions', new Map()),
);

export const getCampaignAdvertiserAccount = createCachedSelector(
  getCampaignEntity,
  getState,
  (campaign, state) => (campaign.get('advertiserAccount')
    ? getAccountShort(state, { itemId: campaign.get('advertiserAccount') })
    : null),
)(getItemId);

export const getCampaignAgencyAccount = createCachedSelector(
  getCampaignEntity,
  getState,
  (campaign, state) => (campaign.get('agencyAccount')
    ? getAccountShort(state, { itemId: campaign.get('agencyAccount') })
    : null),
)(getItemId);

export const getCampaignBrokerAccount = createCachedSelector(
  getCampaignEntity,
  getState,
  (campaign, state) => (campaign.get('brokerAccount')
    ? getAccountShort(state, { itemId: campaign.get('brokerAccount') })
    : null),
)(getItemId);

export const getCampaignPayoutAccount = createCachedSelector(
  getCampaignEntity,
  getState,
  (campaign, state) => (campaign.get('payoutAccount')
    ? getAccountShort(state, { itemId: campaign.get('payoutAccount') })
    : null),
)(getItemId);

export const amountHasData = createCachedSelector(
  getCampaign,
  getCampaignPositionsRoot,
  (campaign, positionsRef) => (
    campaign.get('campaignPositions')
    && campaign.get('campaignPositions').size > 0
    && campaign.get('campaignPositions').some((flightId) => positionsRef.getIn([flightId, 'showAmount']) !== false)
  ),
)(getItemId);

export const campaignAmountHasData = createCachedSelector(
  getCampaign,
  (campaign) => campaign && campaign.get('showAmount') !== false,
)(getItemId);

export const getCampaignChartsRoot = createSelector(
  getRoot,
  (state) => state.get('campaignCharts', new Map()),
);

export const getFlightChartsRoot = createSelector(
  getRoot,
  (state) => state.get('flightCharts', new Map()),
);

export const getSearchFilterRoot = createSelector(
  getRoot,
  (state) => state.get('searchFilter', new Map()),
);

export const getCampaignRoot = createSelector(
  getRoot,
  (state) => state.get('campaignPage', new Map()),
);

export const getDashboardRoot = createSelector(
  getRoot,
  (state) => state.get('dashboardScreenshots', new Map()),
);

export const getDashboardDocumentsRoot = createSelector(
  getRoot,
  (state) => state.get('dashboardDocuments', new Map()),
);

export const getStatisiticsRoot = createSelector(
  getRoot,
  (state) => state.get('statistics', new Map()),
);

export const getCommentsRoot = createSelector(
  getRoot,
  (state) => state.get('activities', new Map()),
);

export const getContact = createSelector(
  getRefs,
  getItemId,
  (state, contactId) => state.getIn(['ContactShort', contactId]),
);

export const getTechActivitiesRoot = createSelector(
  getRoot,
  (state) => state.get('techActivities', new Map()),
);

export const getDocumentsRoot = createSelector(
  getRoot,
  (state) => state.get('documents', new Map()),
);

export const getAccountRoot = createSelector(
  getRoot,
  (state) => state.get('account', new Map()),
);

export const getNewsRoot = createSelector(
  getRoot,
  (state) => state.get('news', new Map()),
);

export const getAddCampaignForm = createSelector(
  getRoot,
  (state) => state.get('addCampaignForm', new Map()),
);

export const getAddPositionForm = createSelector(
  getRoot,
  (state) => state.get('addPositionForm', new Map()),
);

export const getDealsRoot = createSelector(
  getRoot,
  (state) => state.get('deals', new Map()),
);

export const getHistory = createSelector(
  getRoot,
  (state) => state.get('history', new Map()),
);
