import {
  List,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import * as actionTypes from './actionTypes';

const ids = handleActions({
  [tableActionTypes.INIT]: () => new List(),
  [tableActionTypes.SET_ORDER]: () => new List(),
  [actionTypes.GET.COMPLETED]: (state, action) => state.concat(action.payload.ids),
}, new List());

const total = handleActions({
  [actionTypes.GET.COMPLETED]: (state, action) => action.payload.total,
}, 0);

export default combineReducers({
  ids,
  total,
});
