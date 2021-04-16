import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import {
  reset,
  change,
} from 'redux-form/immutable';
import { updateLastCommentTime } from '@adnz/api-ws-funnel';
import notifications from 'src/modules/Notification';
import i18n from 'src/i18n';
import * as actionTypes from './actionTypes';

function* showDeleteCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:ACTIVITY_WAS_DELETED'));
}

function* showCreateCompleted(action) {
  yield put(reset('create-activity'));
  yield call(notifications.success, '', i18n.t('serviceDashboard:ACTIVITY_WAS_CREATED'));
  yield call(updateLastCommentTime, { taskId: action.payload.taskId });
}

function* showCreateMeetingCompleted() {
  yield put(reset('create-activity'));
  yield call(notifications.success, '', i18n.t('serviceDashboard:ACTIVITY_WAS_CREATED'));
}

function* showEditCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:ACTIVITY_WAS_UPDATED'));
}

function* showError(action) {
  yield call(notifications.warning, '', i18n.t(action.payload.message));
}

function* handleContactTypeSelection() {
  yield put(change('create-activity', 'contactId', null));
}

function* rootSaga() {
  yield takeLatest(actionTypes.DELETE_ACTIVITY.FAILED, showError);
  yield takeLatest(actionTypes.DELETE_ACTIVITY.COMPLETED, showDeleteCompleted);
  yield takeLatest(actionTypes.CREATE_ACTIVITY.COMPLETED, showCreateCompleted);
  yield takeLatest(actionTypes.CREATE_MEETING.COMPLETED, showCreateMeetingCompleted);
  yield takeLatest(actionTypes.EDIT_ACTIVITY.COMPLETED, showEditCompleted);
  yield takeLatest(actionTypes.CONTACT_TYPE_SELECTION, handleContactTypeSelection);
}

export default rootSaga;
