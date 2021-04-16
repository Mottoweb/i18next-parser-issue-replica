import { createAction } from 'redux-actions';
import { getCampaignDeliveryDataPerDay } from '@adnz/api-ws-salesforce';
import * as actionTypes from './actionTypes';

export const getCampaignChartData = (token, campaignId) => (dispatch) => {
  dispatch(createAction(actionTypes.GET_CAMPAIGN_CHART.STARTED)({
    campaignId,
  }));
  return getCampaignDeliveryDataPerDay({ campaignId }, token)
    .then(
      ({ data }) => dispatch(createAction(actionTypes.GET_CAMPAIGN_CHART.COMPLETED)({
        campaignId,
        items: data.items,
        startDate: data.startDate,
        endDate: data.endDate,
      })),
      (err) => {
        err.campaignId = campaignId; // eslint-disable-line no-param-reassign
        dispatch(createAction(actionTypes.GET_CAMPAIGN_CHART.FAILED)(err));
      },
    );
};

export const selectCampaignChart = (campaignId, param) => createAction(actionTypes.SELECT_CAMPAIGN_CHART)({
  campaignId,
  param,
});
