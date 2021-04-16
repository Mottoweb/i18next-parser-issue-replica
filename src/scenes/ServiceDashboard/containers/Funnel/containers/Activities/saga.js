import {
  call,
  fork,
  put,
  takeLatest,
} from 'redux-saga/effects';
import i18n from 'src/i18n';
import {
  reset,
} from 'redux-form/immutable';
import notifications from 'src/modules/Notification';
import * as actionTypes from './actionTypes';
import * as actions from './actions';

function* showDeleteCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:ACTIVITY_WAS_DELETED'));
}

function* showCreateCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:ACTIVITY_WAS_CREATED'));
  yield put(reset('create-touchpoint'));
  yield put(actions.closeCreateModal());
}

function* showEditCompleted() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:ACTIVITY_WAS_UPDATED'));
}

function* onMessageChange() {
  yield takeLatest(actionTypes.DELETE_ACTIVITY.COMPLETED, showDeleteCompleted);
  yield takeLatest(actionTypes.CREATE_ACTIVITY.COMPLETED, showCreateCompleted);
  yield takeLatest(actionTypes.CREATE_MEETING.COMPLETED, showCreateCompleted);
  yield takeLatest(actionTypes.EDIT_ACTIVITY.COMPLETED, showEditCompleted);
}

function* rootSaga() {
  yield fork(onMessageChange);
}

export default rootSaga;
