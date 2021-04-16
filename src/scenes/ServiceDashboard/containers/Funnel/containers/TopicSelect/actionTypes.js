import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('topics-select');

export const CHOOSE = namespace.createType('choose');
export const GET_LIST = namespace.createLoadingType('getTopics');
