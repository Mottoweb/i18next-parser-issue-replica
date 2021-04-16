import {
  namespace as root,
} from 'src/scenes/ServiceDashboard/actionTypes';

const namespace = root.fork('flight-chart');

export const GET_FLIGHT_CHART = namespace.createLoadingType('getFlightChart');
export const GET_CREATIVE_DATA = namespace.createLoadingType('getCreativeData');
export const GET_VIEWABILITY = namespace.createLoadingType('getViewability');
export const SELECT_FLIGHT_CHART_TYPE = namespace.createType('selectFlightChartType');
export const SELECT_FLIGHT_CHART_PARAM = namespace.createType('selectFlightChartParam');
export const SELECT_DAY_ORDER = namespace.createType('selectDayOrder');
export const SELECT_VIEWABILITY_ORDER = namespace.createType('selectViewabilityOrder');
export const SELECT_CREATIVE_ORDER = namespace.createType('selectCreativeOrder');
