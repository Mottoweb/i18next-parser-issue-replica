import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('source-select');

export const CHOOSE = namespace.createType('choose');
