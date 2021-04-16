import { fork } from 'redux-saga/effects';
import filterSaga from './containers/SearchFilter/saga';
import accountSaga from './containers/Account/saga';

function* rootSaga() {
  yield fork(accountSaga);
  yield fork(filterSaga);
}

export default rootSaga;
