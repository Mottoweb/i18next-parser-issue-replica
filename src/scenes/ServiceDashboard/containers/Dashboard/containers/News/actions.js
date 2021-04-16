import {
  createAction,
} from 'redux-actions';
import {
  fromJS,
} from 'immutable';
import { getNews as getNewsApi } from '@adnz/api-ws-companies';
import * as actionTypes from './actionTypes';

export const getNews = (token) => (dispatch) => {
  dispatch(createAction(actionTypes.GET_FEEDS.STARTED)());
  return getNewsApi(token)
    .then(
      (result) => dispatch(createAction(actionTypes.GET_FEEDS.COMPLETED)({
        news: fromJS(result.data),
      })),
      (err) => {
        dispatch(createAction(actionTypes.GET_FEEDS.FAILED)(err));
        throw err;
      },
    );
};
