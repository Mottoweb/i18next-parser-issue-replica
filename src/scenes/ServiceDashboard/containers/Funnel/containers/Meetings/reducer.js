import {
  OrderedSet,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createLoadingReducer,
} from 'src/reducerHelper';
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import * as actionTypes from './actionTypes';

const ids = handleActions({
  [actionTypes.GET_MEETINGS.COMPLETED]: (state, action) => state.concat(action.payload.result.get('items')),
  [tableActionTypes.INIT]: () => new OrderedSet([]),
  [tableActionTypes.SET_FILTERS]: () => new OrderedSet([]),
  [tableActionTypes.SET_ORDER]: () => new OrderedSet([]),
  [tableActionTypes.SET_LIMIT]: () => new OrderedSet([]),
}, new OrderedSet());

const total = handleActions({
  [actionTypes.GET_MEETINGS.COMPLETED]: (state, action) => action.payload.result.get('total'),
}, 0);

export default combineReducers({
  ids,
  total,
  loading: createLoadingReducer(actionTypes.GET_MEETINGS),
});
