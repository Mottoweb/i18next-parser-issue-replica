import {
  namespace as root,
} from '../../actionTypes';

const namespace = root.fork('contact-select');

export const CHOOSE = namespace.createType('choose');
