import { createAction } from 'redux-actions';
import axios from 'axios';
import {
  getTopics, getTopicsSchema,
  createMeeting as createMeetingApi, createMeetingSchema,
} from '@adnz/api-ws-funnel';
import {
  createActivity as createActivityApi, deleteActivity as deleteActivityApi, updateActivity, getFunnelTouchpoints,
  getFunnelTouchpointsSchema, deleteActivitySchema, createActivitySchema, updateActivitySchema,
} from '@adnz/api-ws-activity';

import { getValue } from 'src/components/ReactSelectV2Field';
import { Map } from 'immutable';
import { handleFormErrors } from 'src/helpers';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';
import * as selectors from './selectors';

export const getActivities = (taskId, token) => async (dispatch, getState) => {
  const limit = selectors.getActivitiesLimit(getState());
  const isShownAllActivities = selectors.isShownAllActivities(getState());
  const total = selectors.getTotal(getState());
  const params = isShownAllActivities
    ? {
      limit: total,
      sort: 'creationDate',
      order: 'DESC',
    }
    : {
      limit,
      page: 0,
      sort: 'creationDate',
      order: 'DESC',
    };
  try {
    dispatch(createAction(actionTypes.LOAD_ACTIVITIES.STARTED)({
      isShownAllActivities,
      result: Map(),
    }));
    const { data } = await getFunnelTouchpoints({
      ...params,
      taskId,
    }, token);
    const normalized = legacyNormalize(data, getFunnelTouchpointsSchema);
    dispatch(createAction(actionTypes.LOAD_ACTIVITIES.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      isShownAllActivities,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.LOAD_ACTIVITIES.FAILED)(err));
    }
  }
};

export const deleteActivity = (activityId) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.DELETE_ACTIVITY.STARTED)({
      activityId,
      result: Map(),
    }));
    const { data } = await deleteActivityApi({ id: activityId });
    const normalized = legacyNormalize(data, deleteActivitySchema);
    dispatch(createAction(actionTypes.DELETE_ACTIVITY.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      activityId,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.DELETE_ACTIVITY.FAILED)(err));
    }
  }
};

export const createActivity = (payload) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.CREATE_ACTIVITY.STARTED)({
      taskId: payload.taskId,
      result: Map(),
    }));
    const { data } = await createActivityApi(payload);
    const normalized = legacyNormalize(data, createActivitySchema);
    dispatch(createAction(actionTypes.CREATE_ACTIVITY.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      taskId: payload.taskId,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, { taskId: payload.taskId });
      dispatch(createAction(actionTypes.CREATE_ACTIVITY.FAILED)(reducedErr));
      handleFormErrors(err);
    }
  }
};

export const editActivity = (payload) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.EDIT_ACTIVITY.STARTED)({
      result: Map(),
    }));
    const { data } = await updateActivity(payload, { activityId: payload.id });
    const normalized = legacyNormalize(data, updateActivitySchema);
    dispatch(createAction(actionTypes.EDIT_ACTIVITY.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.EDIT_ACTIVITY.FAILED)(err));
      handleFormErrors(err);
    }
  }
};

export const getTopicOptions = (token) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.LOAD_TOPICS.STARTED)({
      result: Map(),
    }));
    const { data } = await getTopics({
      limit: 100,
      page: 0,
      sort: 'title',
      order: 'asc',
    }, token);
    const normalized = legacyNormalize(data, getTopicsSchema);
    dispatch(createAction(actionTypes.LOAD_TOPICS.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      options: normalized.get('entities') ? normalized.getIn(['result', 'items'], new Map()).map((item) => ({
        label: normalized.getIn(['entities', 'TopicDto', item, 'title']),
        value: {
          id: item, topic: { id: item }, isSuccessful: true, toString: () => item,
        },
      })) : null,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.LOAD_TOPICS.FAILED)(err));
    }
  }
};

export const createMeeting = (payload) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.CREATE_MEETING.STARTED)({
      result: Map(),
    }));
    const { data } = await createMeetingApi(payload);
    const normalized = legacyNormalize(data, createMeetingSchema);
    dispatch(createAction(actionTypes.CREATE_MEETING.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.CREATE_MEETING.FAILED)(err));
      handleFormErrors(err);
    }
  }
};

export const contactIsShownChange = (isShown) => createAction(actionTypes.CONTACT_IS_SHOWN_CHANGE)({ isShown });
export const onContactTypeSelect = (type) => createAction(actionTypes.CONTACT_TYPE_SELECTION)({
  value: getValue(type),
});

export const openActivityEditForm = (activityId) => createAction(actionTypes.OPEN_ACTIVITY_EDIT_FORM)({ activityId });
export const closeActivityEditForm = () => createAction(actionTypes.CLOSE_ACTIVITY_EDIT_FORM)();

export const showAllActivities = () => createAction(actionTypes.TOGGLE_SHOW_ALL_ACTIVITIES)({ showAll: true });
export const showLessActivities = () => createAction(actionTypes.TOGGLE_SHOW_ALL_ACTIVITIES)({ showAll: false });
