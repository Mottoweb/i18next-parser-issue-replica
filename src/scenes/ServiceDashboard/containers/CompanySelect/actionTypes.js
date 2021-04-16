import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

const namespace = root.fork('company-select');
export const CHOOSE = namespace.createType('CHOOSE');
