import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createGroup,
} from 'src/reducerHelper';
import * as actionTypes from './actionTypes';

export const value = handleActions({
  [actionTypes.SET_VALUE]: (state, action) => action.payload.value,
}, '');

export const appliedValue = handleActions({
  [actionTypes.SET_APPLIED_VALUE]: (state, action) => action.payload.value,
}, '');

const input = combineReducers({
  value,
  appliedValue,
});

export default createGroup(
  input,
  [
    actionTypes.SET_VALUE,
    actionTypes.SET_APPLIED_VALUE,
  ],
  'type',
);
