import {
  call,
  fork,
  put,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import i18n from 'src/i18n';
import notifications from 'src/modules/Notification';
import * as actionTypes from './actionTypes';
import * as actions from './actions';

function* handleUpdateMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TAG_WAS_UPDATED'));
}

function* handleCreateMessage() {
  yield call(notifications.success, '', i18n.t('serviceDashboard:TAG_WAS_CREATED'));
}

function* handleInput(action) {
  yield delay(500);
  yield put(actions.setFilterApplied(action.payload.value));
}

function* onFilterChange() {
  yield takeLatest(actionTypes.SET_FILTER, handleInput);
}
function* onMessageChange() {
  yield takeLatest(actionTypes.CREATE_TAG.COMPLETED, handleCreateMessage);
  yield takeLatest(actionTypes.UPDATE_TAG.COMPLETED, handleUpdateMessage);

  yield fork(onFilterChange);
}

function* rootSaga() {
  yield fork(onMessageChange);
}

export default rootSaga;
