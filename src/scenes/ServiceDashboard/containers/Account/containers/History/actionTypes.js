import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

export const namespace = root.fork('history');
export const GET_ACTIVITIES = namespace.createLoadingType('getActivities');
