import {
  createAction,
} from 'redux-actions';
import { getTopics, getTopicsSchema } from '@adnz/api-ws-funnel';
import axios from 'axios';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const select = (item, save = false) => createAction(actionTypes.CHOOSE)({
  item,
  save,
});

export const getItems = (token, filter) => (dispatch) => {
  dispatch(createAction(actionTypes.GET_LIST.STARTED)());
  return getTopics({ filter }, token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getTopicsSchema);
        return dispatch(createAction(actionTypes.GET_LIST.COMPLETED)({
          entities: normalized.get('entities'),
          ids: normalized.getIn(['result', 'items']),
          total: data.total,
        }));
      },
      (err) => {
        if (axios.isCancel(err)) {
          return Promise.resolve();
        }
        return dispatch(createAction(actionTypes.GET_LIST.FAILED)(err));
      },
    );
};
