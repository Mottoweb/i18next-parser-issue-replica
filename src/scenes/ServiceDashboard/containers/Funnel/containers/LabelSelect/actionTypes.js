import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('labels-select');

export const CHOOSE = namespace.createType('choose');
