import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

export const namespace = root.fork('Deals');

export const GET = namespace.createLoadingType('get');
