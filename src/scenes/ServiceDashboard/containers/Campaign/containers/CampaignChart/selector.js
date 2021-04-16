import moment from 'moment';
import { getCampaignChartsRoot as getRoot } from 'src/scenes/ServiceDashboard/selector';
import { getItemId } from 'src/selectors';
import createCachedSelector from 're-reselect';
import { toChartFormat } from 'src/helpers';
import { fromJS } from 'immutable';

const getCampaignChartParam = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignId) => state.getIn(['campaignCharts', campaignId, 'param'], 'impressions/clicks'),
)(getItemId);

const getData = (state, campaignId, param) => {
  const items = state.getIn(['campaignCharts', campaignId, 'items'], []);
  return toChartFormat(param)(items);
};

const getClicksData = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignId) => getData(state, campaignId, 'clicks'),
)(getItemId);

const getImpressionsData = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignId) => getData(state, campaignId, 'impressions'),
)(getItemId);

export const getImpressionClicksDataset = createCachedSelector(
  getImpressionsData,
  getClicksData,
  (impressions, clicks) => fromJS({
    impressions,
    clicks,
  }),
)(getItemId);

export const getCampaignChartDataCurrent = createCachedSelector(
  getRoot,
  getItemId,
  getCampaignChartParam,
  getData,
)(getItemId);

export const getCampaignStartDate = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignId) => moment(state.getIn(['campaignCharts', campaignId, 'startDate'])).toDate(),
)(getItemId);

export const getCampaignEndDate = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignId) => moment(state.getIn(['campaignCharts', campaignId, 'endDate'])).toDate(),
)(getItemId);

export const useArea = createCachedSelector(
  getCampaignChartParam,
  (param) => param !== 'ctr' && param !== 'visibility',
)(getItemId);
