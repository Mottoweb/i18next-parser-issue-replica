import {
  getFlightChartsRoot as getRoot,
} from 'src/scenes/ServiceDashboard/selector';
import {
  getParam,
  getItemId,
} from 'src/selectors';
import createCachedSelector from 're-reselect';
import {
  toChartFormat,
  combineResolvers,
} from 'src/helpers';
import {
  List,
  Map,
} from 'immutable';
import i18n from 'src/i18n';
import moment from 'moment';
import { fromDateTime } from '@adnz/api-ws-salesforce';

const getItemIdAndParam = combineResolvers(getParam, getItemId);

export const getDayOrderField = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => state.getIn(['flightCharts', campaignPositionId, 'dayOrderField'], 'date'),
)(getItemId);

export const getDayOrderDirection = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => state.getIn(['flightCharts', campaignPositionId, 'dayOrderDirection'], -1),
)(getItemId);

export const getViewabilityOrderField = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => (
    state.getIn(['flightCharts', campaignPositionId, 'viewabilityOrderField'], 'impressions')
  ),
)(getItemId);

export const getCreativeOrderField = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => (
    state.getIn(['flightCharts', campaignPositionId, 'creativeOrderField'], 'impressions')
  ),
)(getItemId);

export const getViewabilityOrderDirection = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => state.getIn(['flightCharts', campaignPositionId, 'viewabilityOrderDirection'], -1),
)(getItemId);

export const getCreativeOrderDirection = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => state.getIn(['flightCharts', campaignPositionId, 'creativeOrderDirection'], -1),
)(getItemId);

export const getFlightChartType = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => state.getIn(['flightCharts', campaignPositionId, 'type'], 'day'),
)(getItemId);

export const getFlightChartParam = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => state.getIn(['flightCharts', campaignPositionId, 'param'], 'impressions'),
)(getItemId);

const getItems = createCachedSelector(
  getRoot,
  getItemId,
  (state, campaignPositionId) => state.getIn(['flightCharts', campaignPositionId, 'items'], new List()),
)(getItemId);

const getSortItems = (items, orderField, orderDirection) => items.sort((a, b) => {
  const aVal = a.get(orderField);
  const bVal = b.get(orderField);
  if (aVal > bVal) {
    return orderDirection;
  } if (aVal < bVal) {
    return -1 * orderDirection;
  }
  return 0;
});

export const getOrderedItems = createCachedSelector(
  getItems,
  getDayOrderField,
  getDayOrderDirection,
  getSortItems,
)(getItemId);

const getData = (state, param) => toChartFormat(param)(state.toJS());

const getViewabilityData = createCachedSelector(
  getRoot,
  getItemId,
  getFlightChartParam,
  (state, campaignPositionId, param) => (
    state.getIn(['flightCharts', campaignPositionId, 'viewability'], new List())
      .filter((item) => !!item.get(param))
  ),
)(getItemId);

const getCreativeData = createCachedSelector(
  getRoot,
  getItemId,
  getFlightChartParam,
  (state, campaignPositionId, param) => (
    state.getIn(['flightCharts', campaignPositionId, 'creative'], new List())
      .filter((item) => !!item.get(param))
  ),
)(getItemId);

export const getBarsChartData = createCachedSelector(
  getViewabilityData,
  getFlightChartParam,
  (state, param) => state.map((item) => new Map({
    param,
    type: 'website',
    name: item.get('publisher'),
    value: item.get(param),
  })).take(20),
)(getItemId);

export const getCreativeBarsChartData = createCachedSelector(
  getCreativeData,
  getFlightChartParam,
  (state, param) => state.map((item) => new Map({
    param,
    type: 'creative',
    name: item.get('creative'),
    value: item.get(param),
  })).take(20),
)(getItemId);

const labelMap = {
  impressions: 'impressionLabels',
  clicks: 'clickLabels',
  ctr: 'ctrLabels',
};

const getLabelsKey = createCachedSelector(
  getFlightChartParam,
  (type) => (labelMap[type] ? labelMap[type] : null),
)(getItemId);

export const getLabels = createCachedSelector(
  getRoot,
  getItemId,
  getLabelsKey,
  (state, campaignId, key) => state
    .getIn(['flightCharts', campaignId, 'labels', key], new Map())
    .mapEntries(([name, value]) => (
      [name, new Map({ name, value: fromDateTime(value).locale(i18n.language).from(moment.utc()) })]
    ))
    .toList(),
)(getItemId);

export const getViewability = createCachedSelector(
  getViewabilityData,
  getViewabilityOrderField,
  getViewabilityOrderDirection,
  getSortItems,
)(getItemId);

export const getCreatives = createCachedSelector(
  getCreativeData,
  getCreativeOrderField,
  getCreativeOrderDirection,
  getSortItems,
)(getItemId);

export const getCreativesJS = createCachedSelector(
  getCreatives,
  (state) => state.toJS(),
)(getItemId);

const getFlightChartDataForParam = createCachedSelector(
  getItems,
  getParam,
  getData,
)(getItemIdAndParam);

export const getFlightChartData = createCachedSelector(
  getItems,
  getFlightChartParam,
  getData,
)(getItemId);

export const showTab = createCachedSelector(
  getFlightChartDataForParam,
  (data) => data.length > 0,
)(getItemIdAndParam);

export const hasData = createCachedSelector(
  getItems,
  (data) => data.size > 0,
)(getItemId);

export const useArea = createCachedSelector(
  getFlightChartParam,
  (param) => param !== 'ctr' && param !== 'viewability',
)(getItemId);
