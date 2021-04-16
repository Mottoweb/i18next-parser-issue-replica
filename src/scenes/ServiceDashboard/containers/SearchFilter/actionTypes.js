import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

const namespace = root.fork('search-select');

export const SET_VALUE = namespace.createType('setValue');
export const SET_APPLIED_VALUE = namespace.createType('setAppliedValue');
