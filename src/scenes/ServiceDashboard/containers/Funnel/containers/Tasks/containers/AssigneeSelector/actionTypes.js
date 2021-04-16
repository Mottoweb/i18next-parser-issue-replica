import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('assignee-select');

export const TOGGLE = namespace.createType('toggle');
export const CLOSE = namespace.createType('close');
export const CHOOSE = namespace.createType('choose');
export const INIT = namespace.createType('init');
export const GET_LIST = namespace.createLoadingType('getUsers');
