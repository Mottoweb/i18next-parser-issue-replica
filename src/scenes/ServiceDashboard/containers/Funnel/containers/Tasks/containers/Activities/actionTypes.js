import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('activities');

export const LOAD_ACTIVITIES = namespace.createLoadingType('getActivities');

export const LOAD_TOPICS = namespace.createLoadingType('getTopics');
export const CREATE_MEETING = namespace.createLoadingType('createMeeting');
export const CONTACT_IS_SHOWN_CHANGE = namespace.createType('contactIsShownChange');
export const CONTACT_TYPE_SELECTION = namespace.createType('contactTypeSelection');
export const DELETE_ACTIVITY = namespace.createLoadingType('deleteActivity');
export const CREATE_ACTIVITY = namespace.createLoadingType('createActivity');
export const EDIT_ACTIVITY = namespace.createLoadingType('editActivity');
export const OPEN_ACTIVITY_EDIT_FORM = namespace.createType('openActivityEditForm');
export const CLOSE_ACTIVITY_EDIT_FORM = namespace.createType('closeActivityEditForm');
export const TOGGLE_SHOW_ALL_ACTIVITIES = namespace.createType('toggleShowAllActivities');
