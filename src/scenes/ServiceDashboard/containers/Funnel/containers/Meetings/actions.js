import { getMeetings as getMeetingsApi, getMeetingsSchema } from '@adnz/api-ws-funnel';
import { createAction } from 'redux-actions';
import legacyNormalize from 'src/utils/legacyNormalize';
import axios from 'axios';
import { Map } from 'immutable';
import * as actionTypes from './actionTypes';

export const getMeetings = (args, token) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.GET_MEETINGS.STARTED)({
      result: Map(),
    }));
    const { data } = await getMeetingsApi(args, token);
    const normalized = legacyNormalize(data, getMeetingsSchema);
    dispatch(createAction(actionTypes.GET_MEETINGS.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.GET_MEETINGS.FAILED)(err));
    }
  }
};
