import {
  namespace as root,
} from 'src/actionTypes';

export const namespace = root.fork('@agency');

export const GET_FLIGHTS = namespace.createLoadingType('getFlights');
