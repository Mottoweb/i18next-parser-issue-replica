import {
  createAction,
} from 'redux-actions';
import * as actionTypes from './actionTypes';

export const setValue = (value, type) => createAction(actionTypes.SET_VALUE)({
  value,
  type,
});

export const setAppliedValue = (value, type) => createAction(actionTypes.SET_APPLIED_VALUE)({
  value,
  type,
});
