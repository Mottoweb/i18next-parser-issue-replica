import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('Activities');

export const CREATE_MEETING = namespace.createLoadingType('createMeeting');
export const LOAD_ACTIVITIES = namespace.createLoadingType('getActivities');
export const LOAD_TOPICS = namespace.createLoadingType('getTopics');
export const GET_DETAILED_ACCOUNT = namespace.createLoadingType('getDetailedAccount');
export const CLOSE_MODAL = namespace.createType('closeModal');
export const DELETE_ACTIVITY = namespace.createLoadingType('deleteActivity');
export const CREATE_ACTIVITY = namespace.createLoadingType('createActivity');
export const EDIT_ACTIVITY = namespace.createLoadingType('editActivity');
export const OPEN_ACTIVITY_EDIT_FORM = namespace.createType('openActivityEditForm');
export const CLOSE_ACTIVITY_EDIT_FORM = namespace.createType('closeActivityEditForm');
export const GET_CONTACTS_BY_ACCOUNT_ID = namespace.createLoadingType('getContactByAccountId');
export const OPEN_CREATE_MODAL = namespace.createType('openCreateModal');
export const CLOSE_CREATE_MODAL = namespace.createType('closeCreateModal');
