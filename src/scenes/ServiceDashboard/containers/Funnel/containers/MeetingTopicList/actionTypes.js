import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('Topics');

export const LOAD_TOPICS = namespace.createLoadingType('getTopics');
export const UPDATE_TOPIC = namespace.createLoadingType('updateTopic');
export const CREATE_TOPIC = namespace.createLoadingType('createTopic');
export const DELETE_TOPIC = namespace.createLoadingType('deleteTopic');
export const OPEN_MODAL = namespace.createType('openModal');
export const CLOSE_MODAL = namespace.createType('closeModal');
export const SET_FILTER = namespace.createType('setFilter');
export const SET_FILTER_APPLIED = namespace.createType('setFilterApplied');
