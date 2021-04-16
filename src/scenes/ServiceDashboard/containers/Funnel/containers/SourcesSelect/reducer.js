import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import * as actionTypes from './actionTypes';

export const active = handleActions({
  [actionTypes.CHOOSE]: (state, action) => action.payload.item,
}, null);

export default combineReducers({
  active,
});
