import {
  OrderedSet,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createGroup,
  createLoadingReducer,
} from 'src/reducerHelper';
import * as tableActionTypes from 'src/modules/Table/actionTypes';
import * as actionTypes from './actionTypes';
import AssigneeSelect from './containers/AssigneeSelector/reducer';
import EmailForm from './containers/EmailForm/reducer';
import activities from './containers/Activities/reducer';

const taskIds = handleActions({
  [actionTypes.LOAD_TASKS.COMPLETED]: (state, action) => state.concat(action.payload.ids),
  [actionTypes.CREATE_TASK.COMPLETED]: (state, action) => state
    .toList()
    .splice(0, 0, action.payload.ids)
    .toOrderedSet(),
  [actionTypes.SET_ASSIGNEE.COMPLETED]: (state, action) => state.filter((item) => item !== action.payload.id),
  [actionTypes.DELETE_TASK.COMPLETED]: (state, action) => state.filter((item) => item !== action.payload.id),
  [actionTypes.RESTORE_ARCHIVED_TASK.COMPLETED]: (state, action) => state.filter((item) => item !== action.payload.id),
  [tableActionTypes.INIT]: () => new OrderedSet([]),
  [tableActionTypes.SET_FILTERS]: () => new OrderedSet([]),
  [tableActionTypes.SET_ORDER]: () => new OrderedSet([]),
  [tableActionTypes.SET_LIMIT]: () => new OrderedSet([]),
}, new OrderedSet());

const accountContactIds = handleActions({
  [actionTypes.LOAD_CONTACTS.COMPLETED]: (state, action) => action.payload.result.get('accountContacts'),
}, new OrderedSet());

const agencyContactIds = handleActions({
  [actionTypes.LOAD_CONTACTS.COMPLETED]: (state, action) => action.payload.result.get('agencyContacts'),
}, new OrderedSet());

const brokerContactIds = handleActions({
  [actionTypes.LOAD_CONTACTS.COMPLETED]: (state, action) => action.payload.result.get('brokerContacts'),
}, new OrderedSet());

const taskTotal = handleActions({
  [actionTypes.LOAD_TASKS.COMPLETED]: (state, action) => action.payload.total,
}, 0);

const selectedDate = handleActions({
  [actionTypes.SELECT_DATE]: (state, action) => action.payload.date,
  [actionTypes.SNOOZE_TASK.COMPLETED]: () => 0,
  [actionTypes.CLOSE_SNOOZE_MODAL]: () => 0,
}, 0);

const tasks = combineReducers({
  ids: createGroup(taskIds, [
    actionTypes.LOAD_TASKS.COMPLETED,
    actionTypes.CREATE_TASK.COMPLETED,
    actionTypes.SET_ASSIGNEE.COMPLETED,
    actionTypes.DELETE_TASK.COMPLETED,
    actionTypes.RESTORE_ARCHIVED_TASK.COMPLETED,
    tableActionTypes.INIT,
    tableActionTypes.SET_ORDER,
    tableActionTypes.SET_LIMIT,
    tableActionTypes.SET_FILTERS,
  ]),
  total: createGroup(taskTotal, [
    actionTypes.LOAD_TASKS.COMPLETED,
  ]),
});

const withOfferFinishing = handleActions({
  [actionTypes.SHOW_WITH_OFFER_FINISHING]: () => true,
  [actionTypes.SHOW_WITHOUT_OFFER_FINISHING]: () => false,
  [actionTypes.CLOSE_FINISH_MODAL]: () => true,
  [actionTypes.FINISH_TASK.COMPLETED]: () => true,
}, true);

const openedFinishModal = handleActions({
  [actionTypes.OPEN_FINISH_MODAL]: (state, action) => action.payload.id,
  [actionTypes.CLOSE_FINISH_MODAL]: () => null,
  [actionTypes.FINISH_TASK.COMPLETED]: () => null,
}, null);

const isAllCampaignsShownOnFinish = handleActions({
  [actionTypes.TOGGLE_SHOW_ALL_CAMP_ON_FINISH]: (state, action) => !!action.payload.isAllShown,
  [actionTypes.CLOSE_FINISH_MODAL]: () => false,
  [actionTypes.FINISH_TASK.COMPLETED]: () => false,
}, false);

const openedSourceDescriptionModal = handleActions({
  [actionTypes.OPEN_SOURCE_MODAL]: (state, action) => action.payload.id,
  [actionTypes.CLOSE_SOURCE_MODAL]: () => null,
}, null);

const openedRestoreModal = handleActions({
  [actionTypes.OPEN_RESTORE_MODAL]: (state, action) => action.payload.id,
  [actionTypes.CLOSE_RESTORE_MODAL]: () => null,
  [actionTypes.RESTORE_TASK.COMPLETED]: () => null,
}, null);

const openedDeleteModal = handleActions({
  [actionTypes.OPEN_DELETE_MODAL]: (state, action) => action.payload.id,
  [actionTypes.CLOSE_MODAL]: () => null,
  [actionTypes.DELETE_TASK.COMPLETED]: () => null,
}, null);

const openedRestoreArchivedModal = handleActions({
  [actionTypes.OPEN_RESTORE_ARCHIVED_MODAL]: (state, action) => action.payload.id,
  [actionTypes.CLOSE_MODAL]: () => null,
  [actionTypes.RESTORE_ARCHIVED_TASK.COMPLETED]: () => null,
}, null);

const openedSnoozingModal = handleActions({
  [actionTypes.OPEN_SNOOZE_MODAL]: (state, action) => action.payload.id,
  [actionTypes.CLOSE_SNOOZE_MODAL]: () => null,
  [actionTypes.SNOOZE_TASK.COMPLETED]: () => null,
  [actionTypes.DECLINE_SNOOZE_TASK.COMPLETED]: () => null,
}, null);

const isModalOpened = handleActions({
  [actionTypes.OPEN_MODAL]: () => true,
  [actionTypes.CLOSE_MODAL]: () => false,
  [actionTypes.CREATE_TASK.COMPLETED]: () => false,
  [actionTypes.UPDATE_TASK.COMPLETED]: () => false,
}, false);

const showTaskEditForm = handleActions({
  [actionTypes.SHOW_TASK_EDIT_FORM]: () => true,
  [actionTypes.HIDE_TASK_EDIT_FORM]: () => false,
  [actionTypes.UPDATE_TASK.COMPLETED]: () => false,
}, false);

const openedEmailModal = handleActions({
  [actionTypes.OPEN_EMAIL_MODAL.COMPLETED]: (state, action) => action.payload.contactId,
  [actionTypes.CLOSE_EMAIL_MODAL]: () => false,
  [actionTypes.SEND_EMAIL.COMPLETED]: () => false,
}, false);

const loadingEmailModal = handleActions({
  [actionTypes.OPEN_EMAIL_MODAL.STARTED]: (state, action) => action.payload.contactId,
  [actionTypes.OPEN_EMAIL_MODAL.COMPLETED]: () => false,
  [actionTypes.OPEN_EMAIL_MODAL.FAILED]: () => false,
}, false);

const emailFormTaskId = handleActions({
  [actionTypes.OPEN_EMAIL_MODAL.COMPLETED]: (state, action) => action.payload.taskId,
  [actionTypes.CLOSE_EMAIL_MODAL]: () => false,
  [actionTypes.SEND_EMAIL.COMPLETED]: () => false,
}, false);

const contactTypeSelected = handleActions({
  [actionTypes.SELECT_CONTACT_TYPE]: (state, action) => action.payload.type,
}, 'ACCOUNT');

const availableAccountCampaigns = handleActions({
  [actionTypes.GET_ACCOUNT_CAMPAIGNS.COMPLETED]: (state, action) => action.payload.options,
  [actionTypes.UPDATE_TASK.COMPLETED]: () => null,
}, null);

const emailSignature = handleActions({
  [actionTypes.OPEN_EMAIL_MODAL.COMPLETED]: (state, action) => action.payload.signature,
}, null);

const syncInfo = handleActions({
  [actionTypes.GET_SYNC_INFO.COMPLETED]: (state, action) => action.payload.syncInfo,
  [actionTypes.GET_SYNC_INFO.FAILED]: () => null,
}, null);

export default combineReducers({
  tasks,
  selectedDate,
  isModalOpened,
  openedFinishModal,
  openedEmailModal,
  emailFormTaskId,
  openedSnoozingModal,
  AssigneeSelect,
  EmailForm,
  activities,
  accountContactIds,
  agencyContactIds,
  brokerContactIds,
  contactTypeSelected,
  openedSourceDescriptionModal,
  availableAccountCampaigns,
  showTaskEditForm,
  openedDeleteModal,
  openedRestoreModal,
  withOfferFinishing,
  isAllCampaignsShownOnFinish,
  emailSignature,
  loadingEmailModal,
  syncInfo,
  openedRestoreArchivedModal,
  loading: createLoadingReducer(actionTypes.LOAD_TASKS),
  isFinishingTask: createLoadingReducer(actionTypes.FINISH_TASK, false),
});
