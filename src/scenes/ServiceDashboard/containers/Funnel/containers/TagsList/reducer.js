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
  [actionTypes.LOAD_TAGS.COMPLETED]: (state, action) => state.concat(action.payload.ids),
  [tableActionTypes.INIT]: () => new OrderedSet([]),
  [tableActionTypes.SET_FILTERS]: () => new OrderedSet([]),
  [tableActionTypes.SET_ORDER]: () => new OrderedSet([]),
  [tableActionTypes.SET_LIMIT]: () => new OrderedSet([]),
  [actionTypes.CREATE_TAG.COMPLETED]: (state, action) => state.concat(action.payload.ids),
}, new OrderedSet());

const total = handleActions({
  [actionTypes.LOAD_TAGS.COMPLETED]: (state, action) => action.payload.total,
}, 0);

const isModalOpened = handleActions({
  [actionTypes.OPEN_MODAL]: () => true,
  [actionTypes.CLOSE_MODAL]: () => false,
  [actionTypes.UPDATE_TAG.COMPLETED]: () => false,
  [actionTypes.CREATE_TAG.COMPLETED]: () => false,
}, false);

const modalOpenedId = handleActions({
  [actionTypes.OPEN_MODAL]: (state, action) => action.payload.id || null,
}, null);

const filterValue = handleActions({
  [actionTypes.SET_FILTER]: (state, action) => action.payload.value,
}, '');

const filterValueApplied = handleActions({
  [actionTypes.SET_FILTER_APPLIED]: (state, action) => action.payload.value,
}, '');

export default combineReducers({
  ids,
  total,
  modalOpenedId,
  isModalOpened,
  filterValue,
  filterValueApplied,
  loading: createLoadingReducer(actionTypes.LOAD_TAGS),
});
