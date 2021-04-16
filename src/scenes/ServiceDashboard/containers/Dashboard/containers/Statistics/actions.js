import {
  createAction,
} from 'redux-actions';
import {
  fromJS,
} from 'immutable';
import { calculateServiceDashboardStatistics } from '@adnz/api-ws-salesforce';
import * as actionTypes from './actionTypes';

export const getStatistics = (token, companyUuid = '') => (dispatch) => {
  dispatch(createAction(actionTypes.FETCH.STARTED)());
  return calculateServiceDashboardStatistics({ companyUuid }, token)
    .then(
      ({ data }) => dispatch(createAction(actionTypes.FETCH.COMPLETED)({
        data: fromJS(data),
      })),
      (err) => dispatch(createAction(actionTypes.FETCH.FAILED)(err)),
    );
};
