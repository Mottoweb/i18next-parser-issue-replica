import { OrderedSet } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import { createGroup } from 'src/reducerHelper';
import { PURGE_REFS } from 'src/actionTypes';
import * as actionTypes from './actionTypes';
import companySelect from './containers/CompanySelect/reducer';
import campaignCharts from './containers/Campaign/containers/CampaignChart/reducer';
import flightCharts from './containers/Campaign/containers/FlightChart/reducer';
import searchFilter from './containers/SearchFilter/reducer';
import statistics from './containers/Dashboard/containers/Statistics/reducer';
import account from './containers/Account/reducer';
import news from './containers/Dashboard/containers/News/reducer';
import deals from './containers/Deals/reducer';
import history from './containers/History/reducer';

const campaignPositionIds = handleActions({
  [actionTypes.GET_FLIGHTS.COMPLETED]: (state, action) => state.concat(action.payload.ids),
  [tableActionTypes.INIT]: () => new OrderedSet([]),
  [tableActionTypes.SET_FILTERS]: () => new OrderedSet([]),
  [tableActionTypes.SET_ORDER]: () => new OrderedSet([]),
  [tableActionTypes.SET_LIMIT]: () => new OrderedSet([]),
}, new OrderedSet());

const campaignPositionTotal = handleActions({
  [actionTypes.GET_FLIGHTS.COMPLETED]: (state, action) => action.payload.total,
}, 0);

const campaignPositions = combineReducers({
  ids: createGroup(campaignPositionIds, [
    actionTypes.GET_FLIGHTS.COMPLETED,
    tableActionTypes.INIT,
    tableActionTypes.SET_ORDER,
    tableActionTypes.SET_LIMIT,
    tableActionTypes.SET_FILTERS,
    PURGE_REFS,
  ]),
  total: createGroup(campaignPositionTotal, [
    actionTypes.GET_FLIGHTS.COMPLETED,
    PURGE_REFS,
  ]),
});

export default combineReducers({
  companySelect,
  campaignPositions,
  campaignCharts,
  flightCharts,
  searchFilter,
  statistics,
  account,
  news,
  deals,
  history,
});
