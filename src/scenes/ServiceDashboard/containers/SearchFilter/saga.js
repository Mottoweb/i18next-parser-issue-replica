import {
  delay,
  fork,
  put,
  takeLatest,
} from 'redux-saga/effects';
import * as actions from './actions';
import * as actionTypes from './actionTypes';

function* handleInput(action) {
  yield delay(500);
  yield put(actions.setAppliedValue(action.payload.value, action.payload.type));
}

function* onFilterChange() {
  yield takeLatest(actionTypes.SET_VALUE, handleInput);
}

function* rootSaga() {
  yield fork(onFilterChange);
}

export default rootSaga;
