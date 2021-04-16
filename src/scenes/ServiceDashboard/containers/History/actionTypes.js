import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

const namespace = root.fork('history');

export const GET_ACTIVITIES = namespace.createType('getActivities');
