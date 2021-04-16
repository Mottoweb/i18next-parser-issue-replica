import {
  fork,
  put,
  takeLatest,
  call,
  delay,
} from 'redux-saga/effects';
import i18n from 'src/i18n';
import notifications from 'src/modules/Notification';
import * as actionTypes from './actionTypes';
import * as actions from './actions';

function* handleUpdateMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:SOURCE_WAS_UPDATED'));
}

function* handleCreateBatchMessage(action) {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TASK_BATCH_WAS_CREATED', { total: action.payload.total }));
}

function* handleCreateMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:SOURCE_WAS_CREATED'));
}

function* handleDeleteMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:SOURCE_WAS_DELETED'));
}

function* handleDeleteFailedMessage(action) {
  yield call(notifications.warning, '', i18n.t(action.payload.response.data.message));
}

function* handleErrorMessage(action) {
  yield call(notifications.warning, '', i18n.t(action.payload.response.data.message));
}

function* handleInput(action) {
  yield delay(500);
  yield put(actions.setFilterApplied(action.payload.value));
}

function* onFilterChange() {
  yield takeLatest(actionTypes.SET_FILTER, handleInput);
}

function* onMessageChange() {
  yield takeLatest(actionTypes.CREATE_TASK_BATCH.COMPLETED, handleCreateBatchMessage);
  yield takeLatest(actionTypes.CREATE_SOURCE.COMPLETED, handleCreateMessage);
  yield takeLatest(actionTypes.UPDATE_SOURCE.COMPLETED, handleUpdateMessage);
  yield takeLatest(actionTypes.DELETE_SOURCE.COMPLETED, handleDeleteMessage);

  yield takeLatest(actionTypes.CREATE_SOURCE.FAILED, handleErrorMessage);
  yield takeLatest(actionTypes.UPDATE_SOURCE.FAILED, handleErrorMessage);
  yield takeLatest(actionTypes.DELETE_SOURCE.FAILED, handleDeleteFailedMessage);

  yield fork(onFilterChange);
}

function* rootSaga() {
  yield fork(onMessageChange);
}

export default rootSaga;
