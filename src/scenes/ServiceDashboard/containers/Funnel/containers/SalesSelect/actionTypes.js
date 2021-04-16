import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('sales-select');

export const CHOOSE = namespace.createType('choose');
