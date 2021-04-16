import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

const namespace = root.fork('feeds');

export const GET_FEEDS = namespace.createLoadingType('getFeeds');
