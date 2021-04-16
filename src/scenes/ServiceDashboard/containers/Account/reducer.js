import {
  OrderedSet,
} from 'immutable';
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
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import * as actionTypes from './actionTypes';
import numbers from './containers/NumInfoRow/reducer';
import history from './containers/History/reducer';

const ids = handleActions({
  [actionTypes.GET_ACCOUNT_EMAILS.COMPLETED]: (state, action) => action.payload.ids,
  [tableActionTypes.INIT]: () => new OrderedSet([]),
  [tableActionTypes.SET_FILTERS]: () => new OrderedSet([]),
  [tableActionTypes.SET_ORDER]: () => new OrderedSet([]),
  [tableActionTypes.SET_LIMIT]: () => new OrderedSet([]),
}, new OrderedSet());

const activityIds = handleActions({
  [actionTypes.GET_ACCOUNT_ACTIVITIES.COMPLETED]: (state, action) => action.payload.ids,
  [actionTypes.DELETE_ACTIVITY.COMPLETED]: (state, action) => state
    .filter((item) => item !== action.payload.activityId),
}, new OrderedSet());

const total = handleActions({
  [actionTypes.GET_ACCOUNT_EMAILS.COMPLETED]: (state, action) => action.payload.total,
  [actionTypes.DELETE_ACTIVITY.COMPLETED]: (state) => state - 1,
}, 0);

const openedEmailModal = handleActions({
  [actionTypes.OPEN_EMAIL_MODAL]: (state, action) => action.payload.EmailId,
  [actionTypes.CLOSE_MODAL]: () => false,
  [tableActionTypes.INIT]: () => false,
}, false);

const isCreateTaskModalOpened = handleActions({
  [actionTypes.OPEN_CREATE_TASK_MODAL]: () => true,
  [actionTypes.CLOSE_MODAL]: () => false,
  [actionTypes.CREATE_TASK.COMPLETED]: () => false,
}, false);

const openedActivityEditForm = handleActions({
  [actionTypes.OPEN_ACTIVITY_EDIT_FORM]: (state, action) => action.payload.activityId,
  [actionTypes.CLOSE_ACTIVITY_EDIT_FORM]: () => null,
}, null);

export default combineReducers({
  ids,
  activityIds,
  total,
  openedEmailModal,
  openedActivityEditForm,
  isCreateTaskModalOpened,
  loading: createLoadingReducer(actionTypes.GET_ACCOUNT_EMAILS),
  loadingActivities: createLoadingReducer(actionTypes.GET_ACCOUNT_ACTIVITIES),
  loadingAccount: createLoadingReducer(actionTypes.GET_DETAILED_ACCOUNT),
  loadingAttachment: createGroup(createLoadingReducer(actionTypes.GET_ATTACHMENT, false), [
    actionTypes.GET_ATTACHMENT.STARTED,
    actionTypes.GET_ATTACHMENT.COMPLETED,
    actionTypes.GET_ATTACHMENT.FAILED,
  ], 'id'),
  numbers,
  history,
});
