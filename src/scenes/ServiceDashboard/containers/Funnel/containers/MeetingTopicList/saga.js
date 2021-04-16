import {
  put,
  takeLatest,
  fork,
  call,
  delay,
} from 'redux-saga/effects';
import i18n from 'src/i18n';
import notifications from 'src/modules/Notification';
import * as actionTypes from './actionTypes';
import * as actions from './actions';

function* handleUpdateMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TOPIC_WAS_UPDATED'));
}

function* handleCreateMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TOPIC_WAS_CREATED'));
}

function* handleDeleteMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TOPIC_WAS_DELETED'));
}

function* handleDeleteMessageFailed(action) {
  yield call(notifications.warning, '', i18n.t(action.payload.response.data.message));
}

function* handleInput(action) {
  yield delay(500);
  yield put(actions.setFilterApplied(action.payload.value));
}

function* onFilterChange() {
  yield takeLatest(actionTypes.SET_FILTER, handleInput);
}

function* rootSaga() {
  yield takeLatest(actionTypes.CREATE_TOPIC.COMPLETED, handleCreateMessage);
  yield takeLatest(actionTypes.UPDATE_TOPIC.COMPLETED, handleUpdateMessage);
  yield takeLatest(actionTypes.DELETE_TOPIC.COMPLETED, handleDeleteMessage);
  yield takeLatest(actionTypes.DELETE_TOPIC.FAILED, handleDeleteMessageFailed);

  yield fork(onFilterChange);
}

export default rootSaga;
