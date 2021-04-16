import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('outcome-select');

export const CHOOSE = namespace.createType('choose');
