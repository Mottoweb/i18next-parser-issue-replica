import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('creator-select');

export const CHOOSE = namespace.createType('choose');
export const INIT = namespace.createType('init');
export const GET_LIST = namespace.createLoadingType('getCreators');
