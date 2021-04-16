import {
  createAction,
} from 'redux-actions';
import {
  handleFormErrors,
} from 'src/helpers';
import {
  getTagsParameters, TagDto, TagType,
  getTags as getTagsApi, getTagsSchema,
  createTag as createTagApi, createTagSchema,
  updateTag as updateTagApi, updateTagSchema,
} from '@adnz/api-ws-funnel';
import { Dispatch } from 'redux';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getTags = (args: getTagsParameters & any, instance: string) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.LOAD_TAGS.STARTED)({
    instance,
  }));
  return getTagsApi({
    ...args.filters,
    limit: args.limit,
    page: args.page,
    sort: args.sort,
    type: TagType.SALESFUNNEL,
    order: args.order,
  }, args.token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getTagsSchema);
        return dispatch(createAction(actionTypes.LOAD_TAGS.COMPLETED)({
          total: data.total,
          ids: normalized.getIn(['result', 'items']),
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.LOAD_TAGS.FAILED)(err)),
    );
};

export const create = (data1: TagDto) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.CREATE_TAG.STARTED)());
  return createTagApi(data1)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, createTagSchema);
        return dispatch(createAction(actionTypes.CREATE_TAG.COMPLETED)({
          ids: normalized.get('result'),
          entities: normalized.get('entities'),
        }));
      },
      handleFormErrors,
    );
};

export const update = (id: string, data1: TagDto) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.UPDATE_TAG.STARTED)());
  return updateTagApi(data1, { id })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, updateTagSchema);
        return dispatch(createAction(actionTypes.UPDATE_TAG.COMPLETED)({
          ids: normalized.get('result'),
          entities: normalized.get('entities'),
        }));
      },
      handleFormErrors,
    );
};

export const setFilter = (value: string) => createAction(actionTypes.SET_FILTER)({ value });
export const setFilterApplied = (value: string) => createAction(actionTypes.SET_FILTER_APPLIED)({ value });
export const openModal = (id: string) => createAction(actionTypes.OPEN_MODAL)({ id });
export const closeModal = () => createAction(actionTypes.CLOSE_MODAL)();
