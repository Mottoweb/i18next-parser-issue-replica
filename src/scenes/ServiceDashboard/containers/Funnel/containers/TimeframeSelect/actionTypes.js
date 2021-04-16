import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('timeframe-select');

export const CHOOSE = namespace.createType('choose');
