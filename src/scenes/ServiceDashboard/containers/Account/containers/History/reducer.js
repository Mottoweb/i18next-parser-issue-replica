import {
  List,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleAction,
  handleActions,
} from 'redux-actions';
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import * as actionTypes from './actionTypes';

const ids = handleActions({
  [actionTypes.GET_ACTIVITIES.COMPLETED]: (state, action) => action.payload.result.get('items'),
  [tableActionTypes.INIT]: () => new List(),
}, new List());

const total = handleAction(
  actionTypes.GET_ACTIVITIES.COMPLETED,
  (state, action) => action.payload.result.get('total'),
  0,
);

export default combineReducers({
  ids,
  total,
});
