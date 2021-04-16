import {
  namespace as root,
} from '../../actionTypes';

export const namespace = root.fork('Numbers');

export const GET = namespace.createLoadingType('getPaginatedTasks');
export const GET_OFFERED = namespace.createLoadingType('getOffered');
export const GET_BOOKED = namespace.createLoadingType('getBooked');
export const GET_RUNNING = namespace.createLoadingType('getRunning');
export const GET_ARCHIVED = namespace.createLoadingType('getArchived');
