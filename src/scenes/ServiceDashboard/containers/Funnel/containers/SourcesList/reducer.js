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
  [actionTypes.LOAD_SOURCES.COMPLETED]: (state, action) => state.concat(action.payload.ids),
  [actionTypes.DELETE_SOURCE.COMPLETED]: (state, action) => state.delete(action.payload.id),
  [tableActionTypes.INIT]: () => new OrderedSet([]),
  [tableActionTypes.SET_FILTERS]: () => new OrderedSet([]),
  [tableActionTypes.SET_ORDER]: () => new OrderedSet([]),
  [tableActionTypes.SET_LIMIT]: () => new OrderedSet([]),
  [actionTypes.CREATE_SOURCE.COMPLETED]: (state, action) => (action.payload.ids
    ? state.toList().splice(0, 0, action.payload.ids).toOrderedSet() : state),
}, new OrderedSet());

const total = handleActions({
  [actionTypes.LOAD_SOURCES.COMPLETED]: (state, action) => action.payload.total,
}, 0);

const isModalOpened = handleActions({
  [actionTypes.OPEN_MODAL]: () => true,
  [actionTypes.CLOSE_MODAL]: () => false,
  [actionTypes.UPDATE_SOURCE.COMPLETED]: () => false,
  [actionTypes.CREATE_SOURCE.COMPLETED]: () => false,
}, false);

const modalOpenedId = handleActions({
  [actionTypes.OPEN_MODAL]: (state, action) => action.payload.id || null,
}, null);

const descriptionModalId = handleActions({
  [actionTypes.SHOW_DESCRIPTION_MODAL]: (state, action) => action.payload.id,
  [actionTypes.CLOSE_MODAL]: () => null,
}, null);

const isBatchModalOpened = handleActions({
  [actionTypes.OPEN_BATCH_MODAL]: () => true,
  [actionTypes.CLOSE_MODAL]: () => false,
  [actionTypes.CREATE_TASK_BATCH.COMPLETED]: () => false,
}, false);

const batchModalOpenedId = handleActions({
  [actionTypes.OPEN_BATCH_MODAL]: (state, action) => action.payload.id || null,
}, null);

const isShowingDescription = handleActions({
  [actionTypes.SHOW_DESCRIPTION]: () => true,
  [actionTypes.SHOW_DESCRIPTION_MARKDOWN]: () => false,
  [actionTypes.CREATE_SOURCE.COMPLETED]: () => false,
  [actionTypes.UPDATE_SOURCE.COMPLETED]: () => false,
  [actionTypes.CLOSE_MODAL]: () => false,
}, false);

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
  isBatchModalOpened,
  batchModalOpenedId,
  isShowingDescription,
  descriptionModalId,
  filterValue,
  filterValueApplied,
  deleting: createGroup(createLoadingReducer(actionTypes.DELETE_SOURCE), [
    actionTypes.DELETE_SOURCE.STARTED,
    actionTypes.DELETE_SOURCE.COMPLETED,
    actionTypes.DELETE_SOURCE.FAILED,
  ], 'id'),
  loading: createLoadingReducer(actionTypes.LOAD_SOURCES),
});
