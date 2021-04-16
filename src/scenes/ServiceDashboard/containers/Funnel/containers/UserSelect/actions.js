import {
  createAction,
} from 'redux-actions';
import axios from 'axios';
import { getSalesPersons, getSalesPersonsSchema } from '@adnz/api-ws-funnel';
import { Map } from 'immutable';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const select = (item, save = false) => createAction(actionTypes.CHOOSE)({
  item,
  save,
});

export const getItems = (token) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.GET_LIST.STARTED)({
      result: Map(),
    }));
    const { data } = await getSalesPersons(token);
    const normalized = legacyNormalize(data, getSalesPersonsSchema);
    dispatch(createAction(actionTypes.GET_LIST.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      salesUser: normalized.get('entities') && normalized.getIn(['entities', 'UserShort']),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.GET_LIST.FAILED)(err));
    }
  }
};
