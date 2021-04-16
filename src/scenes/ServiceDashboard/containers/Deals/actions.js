import {
  createAction,
} from 'redux-actions';
import { getDealsPage, getDealsPageSchema } from '@adnz/api-ws-deals';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const get = (args) => (dispatch) => {
  dispatch(createAction(actionTypes.GET.STARTED)());

  return getDealsPage({
    page: args.page || 0,
    size: args.limit,
    sort: `${args.sort}.${args.order}`,
  }, args.token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getDealsPageSchema);
        return dispatch(createAction(actionTypes.GET.COMPLETED)({
          total: normalized.getIn(['result', 'total']),
          ids: normalized.getIn(['result', 'items']),
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.GET.FAILED)(err)),
    );
};
