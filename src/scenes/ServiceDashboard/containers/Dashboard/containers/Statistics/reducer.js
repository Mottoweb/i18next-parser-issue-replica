import {
  Map,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createLoadingReducer,
} from 'src/reducerHelper';
import * as actionTypes from './actionTypes';

const data = handleActions({
  [actionTypes.FETCH.COMPLETED]: (state, action) => action.payload.data,
}, new Map());

export default combineReducers({
  loading: createLoadingReducer(actionTypes.FETCH),
  data,
});
