import {
  createAction,
} from 'redux-actions';
import axios from 'axios';
import {
  Map,
  List,
} from 'immutable';
import {
  createActivity as createActivityApi, createActivitySchema, deleteActivity as deleteActivityApi, updateActivity,
  updateActivitySchema, getFunnelTouchpoints, getFunnelTouchpointsSchema,
} from '@adnz/api-ws-activity';
import {
  getTopics as getTopicsApi, getTopicsSchema,
  createMeeting as createMeetingApi, createMeetingSchema,
} from '@adnz/api-ws-funnel';
import {
  handleFormErrors,
} from 'src/helpers';
import {
  getAllOwnedAccountsShort, getAccountById, getAccountByIdSchema,
  getContactByAccountId, getContactByAccountIdSchema, getAllOwnedAccountsShortSchema,
} from '@adnz/api-ws-salesforce';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getLabelValueAccounts = (args, token) => getAllOwnedAccountsShort(args, token)
  .then(
    ({ data }) => {
      const normalized = legacyNormalize(data, getAllOwnedAccountsShortSchema);
      return normalized.getIn(['entities', 'AccountShort'], new Map()).toList().map((item) => ({
        label: item.get('displayName'),
        value: item.get('id'),
      }));
    },
  );

export const getValueContactByAccountId = (accountId, token) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.GET_CONTACTS_BY_ACCOUNT_ID.STARTED)({
      result: Map(),
    }));
    const { data } = await getContactByAccountId({
      accountId,
      active: true,
    }, token);
    const normalized = legacyNormalize(data, getContactByAccountIdSchema);
    const entities = normalized.get('entities');
    dispatch(createAction(actionTypes.GET_CONTACTS_BY_ACCOUNT_ID.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      contacts: (entities && entities.get('ContactDto')) || new List(),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.GET_CONTACTS_BY_ACCOUNT_ID.FAILED)(err));
    }
  }
};

export const getActivities = (args) => (dispatch) => {
  dispatch(createAction(actionTypes.LOAD_ACTIVITIES.STARTED)());
  return getFunnelTouchpoints({
    ...args.filters,
    limit: args.limit,
    page: args.page,
    sort: args.sort,
    order: args.order,
  }, args.token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getFunnelTouchpointsSchema);
        return dispatch(createAction(actionTypes.LOAD_ACTIVITIES.COMPLETED)({
          ids: normalized.getIn(['result', 'items']),
          entities: normalized.get('entities'),
          total: normalized.getIn(['result', 'total']),
        }));
      },
      (err) => dispatch(createAction(actionTypes.LOAD_ACTIVITIES.FAILED)(err)),
    );
};

export const deleteActivity = (activityId) => (dispatch) => {
  dispatch(createAction(actionTypes.DELETE_ACTIVITY.STARTED)({
    activityId,
  }));
  return deleteActivityApi({ id: activityId })
    .then(
      () => dispatch(createAction(actionTypes.DELETE_ACTIVITY.COMPLETED)({ activityId })),
      (err) => dispatch(createAction(actionTypes.DELETE_ACTIVITY.FAILED)(err)),
    );
};

export const createActivity = (data1) => (dispatch) => {
  dispatch(createAction(actionTypes.CREATE_ACTIVITY.STARTED)());
  return createActivityApi(data1)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, createActivitySchema);
        return dispatch(createAction(actionTypes.CREATE_ACTIVITY.COMPLETED)({
          entities: normalized.get('entities'),
          id: normalized.get('result'),
        }));
      },
      handleFormErrors,
    );
};

export const editActivity = (activityId, data1) => (dispatch) => {
  dispatch(createAction(actionTypes.EDIT_ACTIVITY.STARTED)({
    activityId,
  }));
  return updateActivity(data1, { activityId })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, updateActivitySchema);
        return dispatch(createAction(actionTypes.EDIT_ACTIVITY.COMPLETED)({
          entities: normalized.get('entities'),
        }));
      },
      handleFormErrors,
    );
};

export const getTopicOptions = (token) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.LOAD_TOPICS.STARTED)({
      result: Map(),
    }));
    const { data } = await getTopicsApi({
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

export const getDetailedAccount = (token, accountId) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.GET_DETAILED_ACCOUNT.STARTED)({
      result: Map(),
    }));
    const { data } = await getAccountById({ accountId }, token);
    const normalized = legacyNormalize(data, getAccountByIdSchema);
    dispatch(createAction(actionTypes.GET_DETAILED_ACCOUNT.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.GET_DETAILED_ACCOUNT.FAILED)(err));
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
    const entities = normalized.get('entities');
    const activity = entities?.get('ActivityDto');
    const tags = entities?.get('TagDto')?.map((t) => t.get('id')).toList() ?? List();
    const activityWithTags = activity?.map((a) => a.set('tags', tags));
    dispatch(createAction(actionTypes.CREATE_MEETING.COMPLETED)({
      result: normalized.get('result'),
      entities: activity
        ? entities?.set('ActivityDto', activityWithTags)
        : entities,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.CREATE_MEETING.FAILED)(err));
      handleFormErrors(err);
    }
  }
};

export const openActivityEditForm = (activityId) => createAction(actionTypes.OPEN_ACTIVITY_EDIT_FORM)({ activityId });
export const closeActivityEditForm = () => createAction(actionTypes.CLOSE_ACTIVITY_EDIT_FORM)();

export const openCreateModal = () => createAction(actionTypes.OPEN_CREATE_MODAL)();
export const closeCreateModal = () => createAction(actionTypes.CLOSE_CREATE_MODAL)();
