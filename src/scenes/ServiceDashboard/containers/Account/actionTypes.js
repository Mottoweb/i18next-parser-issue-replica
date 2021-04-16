import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

export const namespace = root.fork('account');

export const GET_ACCOUNT_EMAILS = namespace.createLoadingType('getEmails');
export const GET_ACCOUNT_ACTIVITIES = namespace.createLoadingType('getActivities');
export const DELETE_ACTIVITY = namespace.createLoadingType('deleteActivity');
export const OPEN_ACTIVITY_EDIT_FORM = namespace.createType('openActivityEditForm');
export const CLOSE_ACTIVITY_EDIT_FORM = namespace.createType('closeActivityEditForm');
export const TOGGLE_CONTACT_STATE = namespace.createType('toggleContactState');
export const GET_ATTACHMENT = namespace.createLoadingType('getAttachment');
export const GET_DETAILED_ACCOUNT = namespace.createLoadingType('getDetailedAccount');
export const OPEN_EMAIL_MODAL = namespace.createType('openEmailModal');
export const OPEN_CREATE_TASK_MODAL = namespace.createType('closeCreateTaskModal');
export const CREATE_TASK = namespace.createLoadingType('createTask');
export const CLOSE_MODAL = namespace.createType('closeModal');
