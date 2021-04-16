import {
  List,
} from 'immutable';
import {
  combineReducers,
} from 'redux-immutable';
import {
  handleActions,
} from 'redux-actions';
import {
  createLoadingReducer,
} from 'src/reducerHelper';
import * as actionTypes from './actionTypes';
import * as taskActionTypes from '../../actionTypes';

const files = handleActions({
  [actionTypes.FILE_ADDED]: (state, action) => state.concat(action.payload.file),
  [actionTypes.REMOVE_ATTACHMENT.COMPLETED]: (state, action) => state.filter(
    (f) => f.fileName !== action.payload.fileName,
  ),
  [actionTypes.REMOVE_DRAFT.COMPLETED]: () => new List(),
  [taskActionTypes.SEND_EMAIL.COMPLETED]: () => new List(),
}, new List());

const loadingFileProgress = handleActions({
  [actionTypes.UPDATE_PROGRESS]: (state, action) => action.payload.progress,
  [actionTypes.COMPLETE_UPLOADING]: () => 0,
  [actionTypes.ERROR_UPLOADING]: () => 0,
  [actionTypes.REMOVE_DRAFT.COMPLETED]: () => 0,
}, 0);

const loadingFileFileName = handleActions({
  [actionTypes.FILE_ADDED]: (state, action) => action.payload.file.fileName,
  [actionTypes.ERROR_UPLOADING]: () => null,
  [actionTypes.COMPLETE_UPLOADING]: () => null,
  [actionTypes.REMOVE_DRAFT.COMPLETED]: () => null,
}, null);

const draftId = handleActions({
  [actionTypes.CREATE_DRAFT.COMPLETED]: (state, action) => action.payload.draftId,
  [actionTypes.REMOVE_DRAFT.COMPLETED]: () => null,
  [taskActionTypes.SEND_EMAIL.COMPLETED]: () => null,
}, null);

const draftIsCreating = createLoadingReducer(actionTypes.CREATE_DRAFT, false);

const fileIsRemoving = createLoadingReducer(actionTypes.REMOVE_ATTACHMENT, false);

export default combineReducers({
  files,
  loadingFileProgress,
  loadingFileFileName,
  draftId,
  draftIsCreating,
  fileIsRemoving,
});
