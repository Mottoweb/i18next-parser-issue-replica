import {
  combineReducers,
} from 'redux-immutable';
import {
  List,
} from 'immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createLoadingReducer,
  createErrorReducer,
} from 'src/reducerHelper';
import * as actionTypes from './actionTypes';

const loading = createLoadingReducer(actionTypes.GET_FEEDS);
const error = createErrorReducer(actionTypes.GET_FEEDS);

const news = handleActions({
  [actionTypes.GET_FEEDS.COMPLETED]: (state, action) => action.payload.news
    .map((newsItem, i) => newsItem.set('id', i)),
}, new List());

export default combineReducers({
  loading,
  error,
  news,
});
