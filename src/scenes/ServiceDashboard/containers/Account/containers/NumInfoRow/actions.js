import { Map } from 'immutable';
import { createAction } from 'redux-actions';
import axios from 'axios';
import { getAgencyCampaigns, getAgencyCampaignsSchema } from '@adnz/api-ws-salesforce';
import { getPaginatedTasks, getPaginatedTasksSchema } from '@adnz/api-ws-funnel';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getFunnel = (accountId, status, token, outcomeFilter) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.GET.STARTED)({
      result: Map(),
      instance: status,
    }));
    const { data } = await getPaginatedTasks({ accountId, status, outcomeFilter }, token);
    const normalized = legacyNormalize(data, getPaginatedTasksSchema);
    dispatch(createAction(actionTypes.GET.COMPLETED)({
      total: (!!normalized.get('result') && normalized.getIn(['result', 'total'])) || 0,
      instance: status,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, { instance: status });
      dispatch(createAction(actionTypes.GET.FAILED)(reducedErr));
    }
  }
};

export const getSalesforce = (accountId, type, token) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.GET.STARTED)({
      result: Map(),
      instance: type,
    }));
    const { data } = await getAgencyCampaigns({ accountId, type }, token);
    const normalized = legacyNormalize(data, getAgencyCampaignsSchema);
    const result = normalized.get('result');
    dispatch(createAction(actionTypes.GET.COMPLETED)({
      total: (!!result && result.get('total')) || 0,
      instance: type,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, { instance: type });
      dispatch(createAction(actionTypes.GET.FAILED)(reducedErr));
    }
  }
};
