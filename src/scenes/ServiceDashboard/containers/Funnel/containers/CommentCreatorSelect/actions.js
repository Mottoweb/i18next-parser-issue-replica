import {
  createAction,
} from 'redux-actions';
import { getTouchpointCreators, getTouchpointCreatorsSchema } from '@adnz/api-ws-activity';
import axios from 'axios';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const select = (item, save = false) => createAction(actionTypes.CHOOSE)({
  item,
  save,
});

export const getItems = (token) => (dispatch) => {
  dispatch(createAction(actionTypes.GET_LIST.STARTED)());
  return getTouchpointCreators(token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getTouchpointCreatorsSchema);
        return dispatch(createAction(actionTypes.GET_LIST.COMPLETED)({
          entities: normalized.get('entities'),
          ids: normalized.get('result'),
          total: normalized.get('result').size,
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
