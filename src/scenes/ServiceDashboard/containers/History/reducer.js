import {
  handleActions,
} from 'redux-actions';
import {
  combineReducers,
} from 'redux-immutable';
import {
  List,
} from 'immutable';
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import * as actionTypes from './actionTypes';

const ids = handleActions({
  [actionTypes.GET_ACTIVITIES]: (state, action) => state.concat(action.payload.ids),
  [tableActionTypes.SET_ORDER]: () => new List(),
  [tableActionTypes.INIT]: () => new List(),
}, new List());

const total = handleActions({
  [actionTypes.GET_ACTIVITIES]: (state, action) => action.payload.total,
}, 0);

export default combineReducers({
  ids,
  total,
});
