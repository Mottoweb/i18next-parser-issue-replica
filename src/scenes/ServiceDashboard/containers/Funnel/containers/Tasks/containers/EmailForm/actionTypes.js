import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('emailForm');

export const REMOVE_ATTACHMENT = namespace.createLoadingType('removeAttachment');
export const CREATE_DRAFT = namespace.createLoadingType('createDraft');
export const REMOVE_DRAFT = namespace.createLoadingType('removeDraft');
export const FILE_ADDED = namespace.createType('fileAdded');
export const UPDATE_PROGRESS = namespace.createType('updateProgress');
export const COMPLETE_UPLOADING = namespace.createType('completeUploading');
export const ERROR_UPLOADING = namespace.createType('errorUploading');
