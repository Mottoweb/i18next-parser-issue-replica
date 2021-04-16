import {
  createAction,
} from 'redux-actions';
import { createDraft as createDraftApi, deleteDraft, deleteAttachment } from '@adnz/api-ws-email-sync';
import * as actionTypes from './actionTypes';
import * as selectors from './selectors';

export const onFileAdded = (file) => createAction(actionTypes.FILE_ADDED)({ file });
export const handleProgress = (progress) => createAction(actionTypes.UPDATE_PROGRESS)({ progress });
export const handleComplete = () => createAction(actionTypes.COMPLETE_UPLOADING)();
export const handleError = () => createAction(actionTypes.ERROR_UPLOADING)();

export const createDraft = () => (dispatch) => {
  dispatch(createAction(actionTypes.CREATE_DRAFT.STARTED)());
  return createDraftApi()
    .then(
      ({ data }) => dispatch(createAction(actionTypes.CREATE_DRAFT.COMPLETED)({
        draftId: data.draftId,
      })),
      (err) => dispatch(createAction(actionTypes.CREATE_DRAFT.FAILED)(err)),
    );
};

export const removeAttachment = (attachmentName) => (dispatch, getState) => {
  dispatch(createAction(actionTypes.REMOVE_ATTACHMENT.STARTED)({
    fileName: attachmentName,
  }));
  const draftId = selectors.getDraftId(getState());
  return deleteAttachment({ draftId, attachmentName })
    .then(
      () => dispatch(createAction(actionTypes.REMOVE_ATTACHMENT.COMPLETED)({
        fileName: attachmentName,
      })),
      (err) => dispatch(createAction(actionTypes.REMOVE_ATTACHMENT.FAILED)(err)),
    );
};

export const removeDraft = () => (dispatch, getState) => {
  const draftId = selectors.getDraftId(getState());
  if (!draftId) {
    return null;
  }
  dispatch(createAction(actionTypes.REMOVE_DRAFT.STARTED)({
    draftId,
  }));
  return deleteDraft({ draftId })
    .then(
      () => dispatch(createAction(actionTypes.REMOVE_DRAFT.COMPLETED)()),
      (err) => dispatch(createAction(actionTypes.REMOVE_DRAFT.FAILED)(err)),
    );
};
