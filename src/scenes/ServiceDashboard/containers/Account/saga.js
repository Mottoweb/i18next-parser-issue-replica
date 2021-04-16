import {
  takeLatest,
} from 'redux-saga/effects';
import fileSaver from 'file-saver';
import base64toArrayBuffer from 'base64-arraybuffer';
import * as actionTypes from './actionTypes';

function downloadFile(action) {
  const blob = new window.Blob([base64toArrayBuffer.decode(action.payload.data.body)]);
  fileSaver.saveAs(blob, action.payload.data.fileName);
}

function* rootSaga() {
  yield takeLatest(actionTypes.GET_ATTACHMENT.COMPLETED, downloadFile);
}

export default rootSaga;
