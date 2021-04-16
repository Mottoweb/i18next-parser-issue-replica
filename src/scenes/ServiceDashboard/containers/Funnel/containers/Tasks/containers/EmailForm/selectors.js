import {
  createSelector,
} from 'reselect';
import {
  getEmailFormRoot as getRoot,
} from '../../selectors';

export const getDraftId = createSelector(
  getRoot,
  (state) => state.get('draftId'),
);

export const getFiles = createSelector(
  getRoot,
  (state) => state.get('files'),
);

export const getUploadingFileProgress = createSelector(
  getRoot,
  (state) => state.get('loadingFileProgress'),
);

export const fileIsRemoving = createSelector(
  getRoot,
  (state) => state.get('fileIsRemoving'),
);

export const getUploadingFileName = createSelector(
  getRoot,
  (state) => state.get('loadingFileFileName'),
);

export const isDisabledUploadButton = createSelector(
  getUploadingFileName,
  getDraftId,
  (uploadingFileName, draftId) => !!uploadingFileName || !draftId,
);

export const isUploading = createSelector(
  getRoot,
  (state) => !!state.get('loadingFileFileName') || !!state.get('draftIsCreating'),
);
