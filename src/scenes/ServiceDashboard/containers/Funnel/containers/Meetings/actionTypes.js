import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('meetings');

export const GET_MEETINGS = namespace.createLoadingType('getMeetings');
