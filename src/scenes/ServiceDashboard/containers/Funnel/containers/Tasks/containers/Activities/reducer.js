import {
  OrderedSet,
  List,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import * as actionTypes from './actionTypes';
import * as tasksActionTypes from '../../actionTypes';
import * as activitiesActionTypes from '../../../Activities/actionTypes';

const reloadTrigger = handleActions({
  [actionTypes.CREATE_MEETING.COMPLETED]: (state) => !state,
}, false);

const showAllActivities = handleActions({
  [actionTypes.TOGGLE_SHOW_ALL_ACTIVITIES]: (state, action) => action.payload.showAll,
}, false);

const activityIds = handleActions({
  [actionTypes.LOAD_ACTIVITIES.COMPLETED]: (state, action) => action.payload.result.get('items'),
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: (state, action) => state.toList()
    .splice(0, 0, action.payload.result).toOrderedSet(),
  [actionTypes.CREATE_MEETING.COMPLETED]: (state, action) => state.toList()
    .splice(0, 0, action.payload.entities.get('ActivityDto').keySeq().first())
    .toOrderedSet(),
  [activitiesActionTypes.CREATE_MEETING.COMPLETED]: (state, action) => state.toList()
    .splice(0, 0, action.payload.entities.get('ActivityDto').keySeq().first())
    .toOrderedSet(),
  [tasksActionTypes.SEND_EMAIL.COMPLETED]: (state, action) => state.toList()
    .splice(0, 0, action.payload.ids)
    .toOrderedSet(),
  [tasksActionTypes.FINISH_TASK.COMPLETED]: (state, action) => (action.payload.activityId
    ? state.toList().splice(0, 0, action.payload.activityId).toOrderedSet() : state),
  [tasksActionTypes.RESTORE_TASK.COMPLETED]: (state, action) => (action.payload.activityId
    ? state.toList().splice(0, 0, action.payload.activityId).toOrderedSet() : state),
  [tasksActionTypes.SNOOZE_TASK.COMPLETED]: (state, action) => (action.payload.activityId
    ? state.toList().splice(0, 0, action.payload.activityId).toOrderedSet() : state),
  [tasksActionTypes.DECLINE_SNOOZE_TASK.COMPLETED]: (state, action) => (action.payload.activityId
    ? state.toList().splice(0, 0, action.payload.activityId).toOrderedSet() : state),
  [actionTypes.DELETE_ACTIVITY.COMPLETED]: (state, action) => state
    .filter((item) => item !== action.payload.activityId),
}, new OrderedSet());

const contactSelectionIsShown = handleActions({
  [actionTypes.CONTACT_IS_SHOWN_CHANGE]: (state, action) => action.payload.isShown,
  [actionTypes.CREATE_MEETING.COMPLETED]: () => false,
}, false);

const selectedContactType = handleActions({
  [actionTypes.CONTACT_TYPE_SELECTION]: (state, action) => action.payload.value,
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: () => 'CLIENT',
  [actionTypes.CREATE_MEETING.COMPLETED]: () => 'CLIENT',
}, 'CLIENT');

const openedActivityEditForm = handleActions({
  [actionTypes.OPEN_ACTIVITY_EDIT_FORM]: (state, action) => action.payload.activityId,
  [actionTypes.CLOSE_ACTIVITY_EDIT_FORM]: () => null,
  [actionTypes.EDIT_ACTIVITY.COMPLETED]: () => null,
}, null);

const topicOptions = handleActions({
  [actionTypes.LOAD_TOPICS.COMPLETED]: (state, action) => action.payload.options,
}, new List());

const total = handleActions({
  [actionTypes.LOAD_ACTIVITIES.COMPLETED]: (state, action) => action.payload.result.get('total'),
  [actionTypes.CREATE_ACTIVITY.COMPLETED]: (state) => state + 1,
  [actionTypes.CREATE_MEETING.COMPLETED]: (state) => state + 1,
  [actionTypes.DELETE_ACTIVITY.COMPLETED]: (state) => state - 1,
}, 0);

export default combineReducers({
  reloadTrigger,
  activityIds,
  showAllActivities,
  openedActivityEditForm,
  contactSelectionIsShown,
  selectedContactType,
  topicOptions,
  total,
});
