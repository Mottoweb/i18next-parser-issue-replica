import {
  put,
  takeLatest,
} from 'redux-saga/effects';
import {
  change,
} from 'redux-form/immutable';
import * as actionTypes from './actionTypes';
import * as taskActionTypes from '../../actionTypes';
import * as actions from './actions';

function* handleCreateDraft(action) {
  yield put(change('email-funnel-form', 'draftId', action.payload.draftId));
}
function* removeDraft() {
  yield put(actions.removeDraft());
}

function* createDraftOnModalOpen() {
  yield put(actions.createDraft());
}

function* rootSaga() {
  yield takeLatest(actionTypes.CREATE_DRAFT.COMPLETED, handleCreateDraft);
  yield takeLatest(taskActionTypes.OPEN_EMAIL_MODAL.COMPLETED, createDraftOnModalOpen);
  yield takeLatest(taskActionTypes.CLOSE_EMAIL_MODAL, removeDraft);
}

export default rootSaga;
