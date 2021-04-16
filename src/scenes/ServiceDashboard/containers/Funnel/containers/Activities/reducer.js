import {
  List,
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
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import * as actionTypes from './actionTypes';

const ids = handleActions({
  [actionTypes.LOAD_ACTIVITIES.COMPLETED]: (state, action) => state.concat(action.payload.ids),
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: (state, action) => state.unshift(action.payload.id),
  [actionTypes.CREATE_MEETING.COMPLETED]: (state, action) => state
    .unshift(action.payload.entities.get('ActivityDto').toList().getIn([0, 'id'])),
  [actionTypes.DELETE_ACTIVITY.COMPLETED]: (state, action) => state
    .filter((item) => item !== action.payload.activityId),
  [tableActionTypes.INIT]: () => new List([]),
  [tableActionTypes.SET_FILTERS]: () => new List([]),
  [tableActionTypes.SET_ORDER]: () => new List([]),
  [tableActionTypes.SET_LIMIT]: () => new List([]),
}, new List());

const accountId = handleActions({
  [actionTypes.CLOSE_ACTIVITY_EDIT_FORM]: () => null,
  [actionTypes.EDIT_ACTIVITY.COMPLETED]: () => null,
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: () => null,
  [actionTypes.GET_DETAILED_ACCOUNT.COMPLETED]: (state, action) => action.payload.result,
}, null);

const agencyAccountId = handleActions({
  [actionTypes.CLOSE_ACTIVITY_EDIT_FORM]: () => null,
  [actionTypes.EDIT_ACTIVITY.COMPLETED]: () => null,
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: () => null,
  [actionTypes.GET_DETAILED_ACCOUNT.COMPLETED]: (state, action) => action.payload.entities
    .getIn(['AccountDto', action.payload.result, 'defaultBrokerContactId'], null),
}, null);

const brokerAccountId = handleActions({
  [actionTypes.CLOSE_ACTIVITY_EDIT_FORM]: () => null,
  [actionTypes.EDIT_ACTIVITY.COMPLETED]: () => null,
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: () => null,
  [actionTypes.GET_DETAILED_ACCOUNT.COMPLETED]: (state, action) => action.payload.entities
    .getIn(['AccountDto', action.payload.result, 'defaultAgencyContactId'], null),
}, null);

const total = handleActions({
  [actionTypes.LOAD_ACTIVITIES.COMPLETED]: (state, action) => action.payload.total,
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: (state) => state + 1,
  [actionTypes.CREATE_MEETING.COMPLETED]: (state) => state + 1,
  [actionTypes.DELETE_ACTIVITY.COMPLETED]: (state) => state - 1,
}, 0);

const openedActivityEditForm = handleActions({
  [actionTypes.OPEN_ACTIVITY_EDIT_FORM]: (state, action) => action.payload.activityId,
  [actionTypes.CLOSE_ACTIVITY_EDIT_FORM]: () => null,
  [actionTypes.EDIT_ACTIVITY.COMPLETED]: () => null,
}, null);

const isCreateModalOpened = handleActions({
  [actionTypes.OPEN_CREATE_MODAL]: () => true,
  [actionTypes.CLOSE_CREATE_MODAL]: () => false,
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: () => null,
  [actionTypes.CREATE_MEETING.COMPLETED]: () => null,
}, false);

const contactsByAccount = handleActions({
  [actionTypes.GET_CONTACTS_BY_ACCOUNT_ID.COMPLETED]: (state, action) => action.payload.contacts,
}, new List());

const topicOptions = handleActions({
  [actionTypes.LOAD_TOPICS.COMPLETED]: (state, action) => action.payload.options,
}, new List());

export default combineReducers({
  total,
  ids,
  accountId,
  agencyAccountId,
  brokerAccountId,
  openedActivityEditForm,
  loading: createLoadingReducer(actionTypes.LOAD_ACTIVITIES),
  contactsByAccount,
  topicOptions,
  isCreateModalOpened,
});
