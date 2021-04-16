import {
  combineReducers,
} from 'redux-immutable';
import {
  Map,
  List,
} from 'immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createGroup,
} from 'src/reducerHelper';
import * as actionTypes from './actionTypes';

const items = handleActions({
  [actionTypes.GET_FLIGHT_CHART.COMPLETED]: (state, action) => action.payload.items,
}, new List());

const labels = handleActions({
  [actionTypes.GET_FLIGHT_CHART.COMPLETED]: (state, action) => action.payload.labels,
  [actionTypes.GET_VIEWABILITY.COMPLETED]: (state, action) => action.payload.labels,
  [actionTypes.GET_CREATIVE_DATA.COMPLETED]: (state, action) => action.payload.labels,
}, new Map());

const viewability = handleActions({
  [actionTypes.GET_VIEWABILITY.COMPLETED]: (state, action) => action.payload.items,
}, new List());

const creative = handleActions({
  [actionTypes.GET_CREATIVE_DATA.COMPLETED]: (state, action) => action.payload.items,
}, new List());

const type = handleActions({
  [actionTypes.SELECT_FLIGHT_CHART_TYPE]: (state, action) => action.payload.type,
}, 'day');

const param = handleActions({
  [actionTypes.SELECT_FLIGHT_CHART_PARAM]: (state, action) => action.payload.param,
}, 'impressions');

const dayOrderField = handleActions({
  [actionTypes.SELECT_DAY_ORDER]: (state, action) => action.payload.orderField,
}, 'date');

const dayOrderDirection = handleActions({
  [actionTypes.SELECT_DAY_ORDER]: (state, action) => action.payload.orderDirection,
}, -1);

const creativeOrderField = handleActions({
  [actionTypes.SELECT_CREATIVE_ORDER]: (state, action) => action.payload.orderField,
}, 'impressions');

const creativeOrderDirection = handleActions({
  [actionTypes.SELECT_CREATIVE_ORDER]: (state, action) => action.payload.orderDirection,
}, -1);

const viewabilityOrderField = handleActions({
  [actionTypes.SELECT_VIEWABILITY_ORDER]: (state, action) => action.payload.orderField,
}, 'impressions');

const viewabilityOrderDirection = handleActions({
  [actionTypes.SELECT_VIEWABILITY_ORDER]: (state, action) => action.payload.orderDirection,
}, -1);

const flightChart = combineReducers({
  type,
  param,
  items,
  labels,
  viewability,
  creative,
  dayOrderField,
  dayOrderDirection,
  viewabilityOrderField,
  viewabilityOrderDirection,
  creativeOrderField,
  creativeOrderDirection,
});

const flightCharts = createGroup(flightChart, [
  actionTypes.GET_FLIGHT_CHART.STARTED,
  actionTypes.GET_FLIGHT_CHART.COMPLETED,
  actionTypes.GET_FLIGHT_CHART.FAILED,
  actionTypes.GET_CREATIVE_DATA.STARTED,
  actionTypes.GET_CREATIVE_DATA.COMPLETED,
  actionTypes.GET_CREATIVE_DATA.FAILED,
  actionTypes.GET_VIEWABILITY.STARTED,
  actionTypes.GET_VIEWABILITY.COMPLETED,
  actionTypes.GET_VIEWABILITY.FAILED,
  actionTypes.SELECT_FLIGHT_CHART_TYPE,
  actionTypes.SELECT_FLIGHT_CHART_PARAM,
  actionTypes.SELECT_DAY_ORDER,
  actionTypes.SELECT_VIEWABILITY_ORDER,
  actionTypes.SELECT_CREATIVE_ORDER,
], 'campaignPositionId');

export default combineReducers({
  flightCharts,
});
