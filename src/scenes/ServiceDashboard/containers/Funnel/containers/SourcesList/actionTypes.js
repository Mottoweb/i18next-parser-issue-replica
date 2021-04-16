import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('Sources');

export const LOAD_SOURCES = namespace.createLoadingType('getSources');
export const UPDATE_SOURCE = namespace.createLoadingType('updateSource');
export const CREATE_SOURCE = namespace.createLoadingType('createSource');
export const CREATE_TASK_BATCH = namespace.createLoadingType('createTaskBatch');
export const DELETE_SOURCE = namespace.createLoadingType('deleteSource');
export const OPEN_MODAL = namespace.createType('openModal');
export const OPEN_BATCH_MODAL = namespace.createType('openBatchModal');
export const SHOW_DESCRIPTION_MARKDOWN = namespace.createType('showDescriptionMarkdown');
export const SHOW_DESCRIPTION = namespace.createType('showDescription');
export const SHOW_DESCRIPTION_MODAL = namespace.createType('showDescriptionModal');
export const CLOSE_MODAL = namespace.createType('closeModal');
export const SET_FILTER = namespace.createType('setFilter');
export const SET_FILTER_APPLIED = namespace.createType('setFilterApplied');
