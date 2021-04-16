import {
  Map,
} from 'immutable';
import {
  createAction,
} from 'redux-actions';
import axios from 'axios';
import { getActivities as getActivitiesApi, getActivitiesSchema } from '@adnz/api-ws-activity';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getActivities = (entityId) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.GET_ACTIVITIES.STARTED)({
      result: Map(),
    }));
    const { data } = await getActivitiesApi({
      entityId,
      entityType: 'ACCOUNT_UPDATE',
      limit: 10,
      order: 'desc',
      page: 0,
      sort: 'creationDate',
    });
    const normalized = legacyNormalize(data, getActivitiesSchema);
    dispatch(createAction(actionTypes.GET_ACTIVITIES.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.GET_ACTIVITIES.FAILED)(err));
    }
  }
};
