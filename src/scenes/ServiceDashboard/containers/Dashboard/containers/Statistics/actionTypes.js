import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

const namespace = root.fork('statistics');

export const FETCH = namespace.createLoadingType('fetch');
