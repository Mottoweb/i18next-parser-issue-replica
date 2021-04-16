import {
  call,
  fork,
  put,
  takeLatest,
} from 'redux-saga/effects';
import {
  reset,
} from 'redux-form';
import i18n from 'src/i18n';
import notifications from 'src/modules/Notification';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import emailFormSaga from './containers/EmailForm/saga';
import activitiesSaga from './containers/Activities/saga';

function* handleUpdateMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TASK_WAS_UPDATED'));
}

function* handleCreateMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TASK_WAS_CREATED'));
}

function* handleDeleteMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TASK_WAS_DELETED'));
}

function* handleSetMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:ASSIGNEE_WAS_SET'));
}

function* handleFinishCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TASK_WAS_FINISHED'));
}

function* handleRestoreCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TASK_WAS_RESTORED'));
}

function* handleSnoozedCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TASK_WAS_SNOOZED'));
}

function* showAddContactToDefaultCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:CONTACT_IS_SELECTED_AS_DEFAULT'));
}

function* showRemoveContactFromDefaultCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:CONTACT_ID_REMOVED_FROM_DEFAULT'));
}

function* handleDeclineSnoozedCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TASK_WAS_UNSNOOZED'));
  yield put(reset('snooze-task-form'));
}

function* reloadData(action) {
  yield put(actions.getContacts({ filters: { taskId: action.payload.taskId } }));
}

function* showSendEmailCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:EMAIL_WAS_SENT'));
}

function* showSendEmailFailed() {
  yield call(notifications.warning, '', i18n.t('serviceDashboard:GMAIL_EMAIL_IS_NOT_SEND'));
}

function* showError(action) {
  yield call(notifications.warning, '', i18n.t(action.payload.message));
}

function* onMessageChange() {
  yield takeLatest(actionTypes.CREATE_TASK.COMPLETED, handleCreateMessage);
  yield takeLatest(actionTypes.UPDATE_TASK.COMPLETED, handleUpdateMessage);
  yield takeLatest(actionTypes.DELETE_TASK.COMPLETED, handleDeleteMessage);
  yield takeLatest(actionTypes.RESTORE_ARCHIVED_TASK.COMPLETED, handleRestoreCompleted);
  yield takeLatest(actionTypes.SET_ASSIGNEE.COMPLETED, handleSetMessage);

  yield takeLatest(actionTypes.CREATE_TASK.FAILED, showError);
  yield takeLatest(actionTypes.UPDATE_TASK.FAILED, showError);
  yield takeLatest(actionTypes.DELETE_TASK.FAILED, showError);
  yield takeLatest(actionTypes.RESTORE_ARCHIVED_TASK.FAILED, showError);
  yield takeLatest(actionTypes.SET_ASSIGNEE.FAILED, showError);

  yield takeLatest(actionTypes.FINISH_TASK.FAILED, showError);
  yield takeLatest(actionTypes.FINISH_TASK.COMPLETED, handleFinishCompleted);

  yield takeLatest(actionTypes.RESTORE_TASK.FAILED, showError);
  yield takeLatest(actionTypes.RESTORE_TASK.COMPLETED, handleRestoreCompleted);

  yield takeLatest(actionTypes.SNOOZE_TASK.FAILED, showError);
  yield takeLatest(actionTypes.SNOOZE_TASK.COMPLETED, handleSnoozedCompleted);
  yield takeLatest(actionTypes.DECLINE_SNOOZE_TASK.COMPLETED, handleDeclineSnoozedCompleted);

  yield takeLatest(actionTypes.ADD_CONTACT_TO_DEFAULT.FAILED, showError);
  yield takeLatest(actionTypes.ADD_CONTACT_TO_DEFAULT.COMPLETED, showAddContactToDefaultCompleted);

  yield takeLatest(actionTypes.REMOVE_CONTACT_FROM_DEFAULT.FAILED, showError);
  yield takeLatest(actionTypes.REMOVE_CONTACT_FROM_DEFAULT.COMPLETED, showRemoveContactFromDefaultCompleted);

  yield takeLatest(actionTypes.UPDATE_TASK.COMPLETED, reloadData);
  yield takeLatest(actionTypes.CREATE_CONTACT.COMPLETED, reloadData);
  yield takeLatest(actionTypes.SEND_EMAIL.COMPLETED, showSendEmailCompleted);
  yield takeLatest(actionTypes.SEND_EMAIL.FAILED, showSendEmailFailed);
}

function* rootSaga() {
  yield fork(onMessageChange);
  yield fork(emailFormSaga);
  yield fork(activitiesSaga);
}

export default rootSaga;
