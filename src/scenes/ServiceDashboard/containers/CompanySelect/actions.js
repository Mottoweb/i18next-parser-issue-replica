import { createAction } from 'redux-actions';
import * as actionTypes from './actionTypes';

export const select = (item) => createAction(actionTypes.CHOOSE)({
  item,
});
