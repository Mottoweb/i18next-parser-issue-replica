import {
  createAction,
} from 'redux-actions';
import axios from 'axios';
import {
  getTaskTopics as getTaskTopicsApi, getTaskTopicsSchema,
  createTaskTopic as createTaskTopicApi, createTaskTopicSchema,
  updateTaskTopic as updateTaskTopicApi, updateTaskTopicSchema,
  deleteTaskTopic as deleteTaskTopicApi,
} from '@adnz/api-ws-funnel';
import { Map, fromJS } from 'immutable';
import { handleFormErrors } from 'src/helpers';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getTaskTopics = (args, token) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.LOAD_TOPICS.STARTED)({
      result: Map(),
    }));
    const { data } = await getTaskTopicsApi(args, token);
    const normalized = legacyNormalize(data, getTaskTopicsSchema);
    dispatch(createAction(actionTypes.LOAD_TOPICS.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.LOAD_TOPICS.FAILED)(err));
    }
  }
};

export const create = (args) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.CREATE_TOPIC.STARTED)({
      result: Map(),
    }));
    const { data } = await createTaskTopicApi(args);
    const normalized = legacyNormalize(data, createTaskTopicSchema);
    dispatch(createAction(actionTypes.CREATE_TOPIC.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.CREATE_TOPIC.FAILED)(err));
      handleFormErrors(err);
    }
  }
};

export const update = (id, payload) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.UPDATE_TOPIC.STARTED)({
      result: Map(),
    }));
    const { data } = await updateTaskTopicApi(payload, { id });
    const normalized = legacyNormalize(data, updateTaskTopicSchema);
    dispatch(createAction(actionTypes.UPDATE_TOPIC.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.UPDATE_TOPIC.FAILED)(err));
      handleFormErrors(err);
    }
  }
};

export const deleteTopic = (id) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.DELETE_TOPIC.STARTED)({
      result: Map(),
      id,
    }));
    const { data } = await deleteTaskTopicApi({ id });
    dispatch(createAction(actionTypes.DELETE_TOPIC.COMPLETED)({
      result: fromJS(data),
      id,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, { id });
      dispatch(createAction(actionTypes.DELETE_TOPIC.FAILED)(reducedErr));
    }
  }
};

export const setFilter = (value) => createAction(actionTypes.SET_FILTER)({ value });
export const setFilterApplied = (value) => createAction(actionTypes.SET_FILTER_APPLIED)({ value });
export const openModal = (id) => createAction(actionTypes.OPEN_MODAL)({ id });
export const closeModal = () => createAction(actionTypes.CLOSE_MODAL)();
