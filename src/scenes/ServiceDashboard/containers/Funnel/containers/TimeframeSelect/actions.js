import {
  createAction,
} from 'redux-actions';
import * as actionTypes from './actionTypes';

export const select = (item, save = false) => createAction(actionTypes.CHOOSE)({
  item,
  save,
});
