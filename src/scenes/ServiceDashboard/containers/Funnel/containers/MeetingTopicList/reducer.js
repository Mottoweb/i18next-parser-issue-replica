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
  createGroup,
  createLoadingReducer,
} from 'src/reducerHelper';
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import * as actionTypes from './actionTypes';

const ids = handleActions({
  [actionTypes.LOAD_TOPICS.COMPLETED]: (state, action) => state.concat(action.payload.result.get('items')),
  [actionTypes.DELETE_TOPIC.COMPLETED]: (state, action) => state.delete(action.payload.id),
  [tableActionTypes.INIT]: () => new OrderedSet([]),
  [tableActionTypes.SET_FILTERS]: () => new OrderedSet([]),
  [tableActionTypes.SET_ORDER]: () => new OrderedSet([]),
  [tableActionTypes.SET_LIMIT]: () => new OrderedSet([]),
  [actionTypes.CREATE_TOPIC.COMPLETED]: (state, action) => (action.payload.result
    ? state.toList().splice(0, 0, action.payload.result).toOrderedSet() : state),
}, new OrderedSet());

const total = handleActions({
  [actionTypes.LOAD_TOPICS.COMPLETED]: (state, action) => action.payload.result.get('total'),
}, 0);

const isModalOpened = handleActions({
  [actionTypes.OPEN_MODAL]: () => true,
  [actionTypes.CLOSE_MODAL]: () => false,
  [actionTypes.UPDATE_TOPIC.COMPLETED]: () => false,
  [actionTypes.CREATE_TOPIC.COMPLETED]: () => false,
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
  deleting: createGroup(createLoadingReducer(actionTypes.DELETE_TOPIC), [
    actionTypes.DELETE_TOPIC.STARTED,
    actionTypes.DELETE_TOPIC.COMPLETED,
    actionTypes.DELETE_TOPIC.FAILED,
  ], 'id'),
  loading: createLoadingReducer(actionTypes.LOAD_TOPICS),
});
