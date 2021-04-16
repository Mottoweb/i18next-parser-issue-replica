import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createGroup,
  createLoadingReducer,
} from 'src/reducerHelper';
import * as actionTypes from './actionTypes';
import * as accountActionTypes from '../../actionTypes';

const count = createGroup(
  handleActions({
    [actionTypes.GET.COMPLETED]: (state, action) => action.payload.total,
    [accountActionTypes.CREATE_TASK.COMPLETED]: (state) => state + 1,
  }, 0),
  [actionTypes.GET.COMPLETED, accountActionTypes.CREATE_TASK.COMPLETED],
  'instance',
);

const loading = createGroup(
  createLoadingReducer(actionTypes.GET),
  [
    actionTypes.GET.STARTED,
    actionTypes.GET.COMPLETED,
    actionTypes.GET.FAILED,
  ],
  'instance',
);

export default combineReducers({
  count,
  loading,
});
