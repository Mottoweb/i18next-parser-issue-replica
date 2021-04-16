import { List } from 'immutable'; import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import * as actionTypes from './actionTypes';

export const active = handleActions({
  [actionTypes.CHOOSE]: (state, action) => action.payload.item,
}, null);

export const salesUser = handleActions({
  [actionTypes.GET_LIST.COMPLETED]: (state, action) => action.payload.salesUser,
}, new List());

export default combineReducers({
  active,
  salesUser,
});
