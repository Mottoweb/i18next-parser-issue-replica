import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import { createGroup } from 'src/reducerHelper';
import * as actionTypes from './actionTypes';

const campaignChartData = handleActions({
  [actionTypes.GET_CAMPAIGN_CHART.COMPLETED]: (state, action) => action.payload.items,
}, []);

const campaignStartDate = handleActions({
  [actionTypes.GET_CAMPAIGN_CHART.COMPLETED]: (state, action) => action.payload.startDate,
}, null);

const campaignEndDate = handleActions({
  [actionTypes.GET_CAMPAIGN_CHART.COMPLETED]: (state, action) => action.payload.endDate,
}, null);

const campaignChartParam = handleActions({
  [actionTypes.SELECT_CAMPAIGN_CHART]: (state, action) => action.payload.param,
}, 'impressions/clicks');

const campaignChart = combineReducers({
  param: campaignChartParam,
  items: campaignChartData,
  startDate: campaignStartDate,
  endDate: campaignEndDate,
});

const campaignCharts = createGroup(campaignChart, [
  actionTypes.GET_CAMPAIGN_CHART.STARTED,
  actionTypes.GET_CAMPAIGN_CHART.COMPLETED,
  actionTypes.GET_CAMPAIGN_CHART.FAILED,
  actionTypes.SELECT_CAMPAIGN_CHART,
], 'campaignId');

export default combineReducers({
  campaignCharts,
});
