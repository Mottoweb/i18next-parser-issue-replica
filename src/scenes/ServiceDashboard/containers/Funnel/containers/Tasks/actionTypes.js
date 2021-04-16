import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('Tasks');

export const LOAD_TASKS = namespace.createLoadingType('getTasks');
export const LOAD_CONTACTS = namespace.createLoadingType('getContacts');
export const GET_ACCOUNT_CAMPAIGNS = namespace.createLoadingType('getAccountCampaigns');
export const ADD_CONTACT_TO_DEFAULT = namespace.createLoadingType('addContactToDefault');
export const REMOVE_CONTACT_FROM_DEFAULT = namespace.createLoadingType('removeContactFromDefault');
export const GET_SYNC_INFO = namespace.createLoadingType('getSyncInfo');
export const LOAD_TASK = namespace.createLoadingType('getTask');
export const CREATE_TASK = namespace.createLoadingType('createTasks');
export const UPDATE_TASK = namespace.createLoadingType('updateTasks');
export const DELETE_TASK = namespace.createLoadingType('deleteTasks');
export const SET_ASSIGNEE = namespace.createLoadingType('setAssignee');
export const FINISH_TASK = namespace.createLoadingType('finishTask');
export const RESTORE_TASK = namespace.createLoadingType('restoreTask');
export const RESTORE_ARCHIVED_TASK = namespace.createLoadingType('restoreArchivedTask');
export const SNOOZE_TASK = namespace.createLoadingType('snoozeTask');
export const DECLINE_SNOOZE_TASK = namespace.createLoadingType('declineSnoozeTask');
export const OPEN_MODAL = namespace.createType('openModal');
export const OPEN_DELETE_MODAL = namespace.createType('openDeleteModal');
export const OPEN_RESTORE_ARCHIVED_MODAL = namespace.createType('openRestoreArchivedModal');
export const SHOW_WITH_OFFER_FINISHING = namespace.createType('showWithOfferFinishing');
export const SHOW_WITHOUT_OFFER_FINISHING = namespace.createType('showWithoutOfferFinishing');
export const CLOSE_MODAL = namespace.createType('closeModal');
export const OPEN_SNOOZE_MODAL = namespace.createType('openSnoozeModal');
export const CLOSE_SNOOZE_MODAL = namespace.createType('closeSnoozeModal');
export const OPEN_SOURCE_MODAL = namespace.createType('openSourceModal');
export const CLOSE_SOURCE_MODAL = namespace.createType('closeSourceModal');
export const OPEN_FINISH_MODAL = namespace.createType('openFinishModal');
export const TOGGLE_SHOW_ALL_CAMP_ON_FINISH = namespace.createType('toggleShowAllCampOnFinish');
export const CLOSE_FINISH_MODAL = namespace.createType('closeFinishModal');
export const OPEN_RESTORE_MODAL = namespace.createType('openRestoreModal');
export const CLOSE_RESTORE_MODAL = namespace.createType('closeRestoreModal');
export const SELECT_DATE = namespace.createType('selectDate');
export const OPEN_EMAIL_MODAL = namespace.createLoadingType('openEmailModal');
export const CLOSE_EMAIL_MODAL = namespace.createType('closeEmailModal');
export const SEND_EMAIL = namespace.createLoadingType('closeEmailModal');
export const SHOW_TASK_EDIT_FORM = namespace.createType('showTaskEditForm');
export const HIDE_TASK_EDIT_FORM = namespace.createType('hideTaskEditForm');
export const SELECT_CONTACT_TYPE = namespace.createType('selectContactType');
export const CREATE_CONTACT = namespace.createLoadingType('createContact');
export const GET_SOURCES = namespace.createLoadingType('getSources');
export const GET_TASK_TOPICS = namespace.createLoadingType('getTaskTopics');
