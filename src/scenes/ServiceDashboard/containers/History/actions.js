import { getActivities as getActivitiesApi, getActivitiesSchema } from '@adnz/api-ws-activity';
import {
  createAction,
} from 'redux-actions';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getActivities = ({
  token, filters: { campaignId, accountId }, ...args
}) => (dispatch) => getActivitiesApi(
  {
    page: 0,
    ...args,
    entityId: campaignId || accountId,
    entityType: campaignId ? 'CAMPAIGN_UPDATE' : 'ACCOUNT_UPDATE',
  },
  token,
).then(({ data }) => {
  const normalized = legacyNormalize(data, getActivitiesSchema);
  dispatch(createAction(actionTypes.GET_ACTIVITIES)({
    entities: normalized.get('entities'),
    ids: normalized.getIn(['result', 'items']),
    total: normalized.getIn(['result', 'total']),
  }));
});
