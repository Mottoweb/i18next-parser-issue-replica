import {
  List,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import * as actionTypes from './actionTypes';

export const ids = handleActions({
  [actionTypes.GET_LIST.COMPLETED]: (state, action) => action.payload.ids,
}, new List());

export const total = handleActions({
  [actionTypes.GET_LIST.COMPLETED]: (state, action) => action.payload.total,
}, 0);

export const active = handleActions({
  [actionTypes.CHOOSE]: (state, action) => action.payload.item,
}, null);

export default combineReducers({
  ids,
  total,
  active,
});
