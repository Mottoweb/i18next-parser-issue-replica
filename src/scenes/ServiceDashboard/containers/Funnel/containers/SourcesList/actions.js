import {
  createAction,
} from 'redux-actions';
import {
  handleFormErrors,
} from 'src/helpers';
import {
  createTaskBatch as createTaskBatchApi, getSources as getSourcesApi, getSourcesSchema, createSource,
  createSourceSchema, updateSource as updateSourceApi, updateSourceSchema, deleteSource as deleteSourceApi,
} from '@adnz/api-ws-funnel';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getSources = (args, instance) => (dispatch) => {
  dispatch(createAction(actionTypes.LOAD_SOURCES.STARTED)({
    instance,
  }));
  return getSourcesApi({
    ...args.filters,
    limit: args.limit,
    page: args.page,
    sort: args.sort,
    order: args.order,
  }, args.token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getSourcesSchema);
        return dispatch(createAction(actionTypes.LOAD_SOURCES.COMPLETED)({
          total: data.total,
          ids: normalized.getIn(['result', 'items']),
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.LOAD_SOURCES.FAILED)(err)),
    );
};

export const create = (data1) => (dispatch) => {
  dispatch(createAction(actionTypes.CREATE_SOURCE.STARTED)());
  return createSource(data1)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, createSourceSchema);
        return dispatch(createAction(actionTypes.CREATE_SOURCE.COMPLETED)({
          ids: normalized.get('result'),
          entities: normalized.get('entities'),
        }));
      },
      handleFormErrors,
    );
};

export const createTaskBatch = (args) => (dispatch) => {
  dispatch(createAction(actionTypes.CREATE_TASK_BATCH.STARTED)());
  return createTaskBatchApi(args)
    .then(
      ({ data }) => dispatch(createAction(actionTypes.CREATE_TASK_BATCH.COMPLETED)({
        total: data.total,
      })),
      handleFormErrors,
    );
};

export const update = (id, data1) => (dispatch) => {
  dispatch(createAction(actionTypes.UPDATE_SOURCE.STARTED)());
  return updateSourceApi(data1, { id })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, updateSourceSchema);
        return dispatch(createAction(actionTypes.UPDATE_SOURCE.COMPLETED)({
          ids: normalized.get('result'),
          entities: normalized.get('entities'),
        }));
      },
      handleFormErrors,
    );
};

export const deleteSource = (id) => (dispatch) => {
  dispatch(createAction(actionTypes.DELETE_SOURCE.STARTED)({
    id,
  }));
  return deleteSourceApi({ id })
    .then(
      () => dispatch(createAction(actionTypes.DELETE_SOURCE.COMPLETED)({
        id,
      })),
      (err) => {
        err.id = id; // eslint-disable-line no-param-reassign
        return dispatch(createAction(actionTypes.DELETE_SOURCE.FAILED)(err));
      },
    );
};

export const openModal = (id) => createAction(actionTypes.OPEN_MODAL)({ id });
export const showDescriptionModal = (id) => createAction(actionTypes.SHOW_DESCRIPTION_MODAL)({ id });
export const openBatchModal = (id) => createAction(actionTypes.OPEN_BATCH_MODAL)({ id });
export const showDescription = () => createAction(actionTypes.SHOW_DESCRIPTION)();
export const showDescriptionMarkdown = () => createAction(actionTypes.SHOW_DESCRIPTION_MARKDOWN)();
export const closeModal = () => createAction(actionTypes.CLOSE_MODAL)();
export const setFilter = (value) => createAction(actionTypes.SET_FILTER)({ value });
export const setFilterApplied = (value) => createAction(actionTypes.SET_FILTER_APPLIED)({ value });
