import {
  createAction,
} from 'redux-actions';
import {
  List,
} from 'immutable';
import {
  findCampaignPositionsByAccount as findCampaignPositionsByAccountApi, findCampaignPositionsByAccountSchema,
} from '@adnz/api-ws-salesforce';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getFlights = (args, instance) => (dispatch) => {
  dispatch(createAction(actionTypes.GET_FLIGHTS.STARTED)({
    instance,
  }));
  return findCampaignPositionsByAccountApi({
    ...args.filters,
    limit: args.limit,
    page: args.page,
    sort: args.sort,
    order: args.order,
  }, args.token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, findCampaignPositionsByAccountSchema);
        return dispatch(createAction(actionTypes.GET_FLIGHTS.COMPLETED)({
          instance,
          entities: normalized.get('entities'),
          ids: normalized.getIn(['result', 'items'], new List()),
          total: normalized.getIn(['result', 'total']),
        }));
      },
      (err) => dispatch(createAction(actionTypes.GET_FLIGHTS.FAILED)(err)),
    );
};
