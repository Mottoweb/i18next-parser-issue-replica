import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('Tags');

export const LOAD_TAGS = namespace.createLoadingType('getTags');
export const UPDATE_TAG = namespace.createLoadingType('updateTag');
export const CREATE_TAG = namespace.createLoadingType('createTag');
export const OPEN_MODAL = namespace.createType('openModal');
export const CLOSE_MODAL = namespace.createType('closeModal');
export const SET_FILTER = namespace.createType('setFilter');
export const SET_FILTER_APPLIED = namespace.createType('setFilterApplied');
