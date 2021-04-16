import {
  createAction,
} from 'redux-actions';
import axios from 'axios';
import {
  getDeliveryDataPerDay, getDeliveryDataPerPublisher, getDeliveryDataPerCreative,
} from '@adnz/api-ws-salesforce';
import { fromJS, Map } from 'immutable';
import * as actionTypes from './actionTypes';
import * as selectors from './selector';

export const getFlightChartData = (token, campaignPositionId) => (dispatch) => {
  dispatch(createAction(actionTypes.GET_FLIGHT_CHART.STARTED)({
    campaignPositionId,
  }));
  return getDeliveryDataPerDay({ campaignPositionId }, token)
    .then(
      ({ data }) => dispatch(createAction(actionTypes.GET_FLIGHT_CHART.COMPLETED)({
        campaignPositionId,
        labels: fromJS(data.labels),
        items: fromJS(data.items),
      })),
      (err) => {
        err.campaignPositionId = campaignPositionId; // eslint-disable-line no-param-reassign
        dispatch(createAction(actionTypes.GET_FLIGHT_CHART.FAILED)(err));
        throw err;
      },
    );
};

export const getViewability = (token, campaignPositionId) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.GET_VIEWABILITY.STARTED)({
      result: Map(),
      campaignPositionId,
    }));
    const { data } = await getDeliveryDataPerPublisher({ campaignPositionId }, token);
    dispatch(createAction(actionTypes.GET_VIEWABILITY.COMPLETED)({
      result: fromJS(data),
      campaignPositionId,
      labels: fromJS(data.labels),
      items: fromJS(data.items),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, { campaignPositionId });
      dispatch(createAction(actionTypes.GET_VIEWABILITY.FAILED)(reducedErr));
    }
  }
};

export const getCreativeData = (token, campaignPositionId) => (dispatch) => {
  dispatch(createAction(actionTypes.GET_CREATIVE_DATA.STARTED)({
    campaignPositionId,
  }));
  return getDeliveryDataPerCreative({ campaignPositionId }, token)
    .then(
      ({ data }) => dispatch(createAction(actionTypes.GET_CREATIVE_DATA.COMPLETED)({
        campaignPositionId,
        labels: fromJS(data.labels ?? []),
        items: fromJS(data.items ?? []),
      })),
      (err) => {
        err.campaignPositionId = campaignPositionId; // eslint-disable-line no-param-reassign
        dispatch(createAction(actionTypes.GET_CREATIVE_DATA.FAILED)(err));
        throw err;
      },
    );
};

export const selectFlightChartType = (campaignPositionId, type) => (
  createAction(actionTypes.SELECT_FLIGHT_CHART_TYPE)({
    campaignPositionId,
    type,
  })
);

export const selectFlightChartParam = (campaignPositionId, param) => (
  createAction(actionTypes.SELECT_FLIGHT_CHART_PARAM)({
    campaignPositionId,
    param,
  })
);

export const selectDayOrder = (campaignPositionId, orderField) => (dispatch, getState) => {
  const orderDirection = -1 * selectors.getDayOrderDirection(getState(), { itemId: campaignPositionId });
  dispatch(createAction(actionTypes.SELECT_DAY_ORDER)({
    orderField,
    orderDirection,
    campaignPositionId,
  }));
};

export const selectViewabilityOrder = (campaignPositionId, orderField) => (dispatch, getState) => {
  const orderDirection = -1 * selectors.getViewabilityOrderDirection(getState(), { itemId: campaignPositionId });
  dispatch(createAction(actionTypes.SELECT_VIEWABILITY_ORDER)({
    orderField,
    orderDirection,
    campaignPositionId,
  }));
};

export const selectCreativeOrder = (campaignPositionId, orderField) => (dispatch, getState) => {
  const orderDirection = -1 * selectors.getCreativeOrderDirection(getState(), { itemId: campaignPositionId });
  dispatch(createAction(actionTypes.SELECT_CREATIVE_ORDER)({
    orderField,
    orderDirection,
    campaignPositionId,
  }));
};
