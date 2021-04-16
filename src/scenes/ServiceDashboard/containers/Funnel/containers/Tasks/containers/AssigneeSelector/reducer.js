import {
  List,
  Map,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createLoadingReducer,
  createErrorReducer,
} from 'src/reducerHelper';
import * as actionTypes from './actionTypes';

export const opened = handleActions({
  [actionTypes.TOGGLE]: (state, action) => (state === action.payload.id ? false : action.payload.id),
}, false);

export const items = handleActions({
  [actionTypes.GET_LIST.COMPLETED]: (state, action) => action.payload.items,
}, new List());

export const total = handleActions({
  [actionTypes.GET_LIST.COMPLETED]: (state, action) => action.payload.total,
}, 0);

export const active = handleActions({
  [actionTypes.CHOOSE]: (state, action) => state.mergeDeep(action.payload.selected),
  [actionTypes.INIT]: (state, action) => state.mergeDeep(action.payload.selected),
}, new Map());

export const isDefaultListLoading = handleActions({
  [actionTypes.GET_LIST.STARTED]: () => true,
  [actionTypes.GET_LIST.COMPLETED]: () => false,
}, false);

export const isLoading = createLoadingReducer(actionTypes.GET_LIST, false);

export const errorMessage = createErrorReducer(actionTypes.GET_LIST);

export default combineReducers({
  items,
  total,
  opened,
  isLoading,
  active,
  errorMessage,
  isDefaultListLoading,
});
