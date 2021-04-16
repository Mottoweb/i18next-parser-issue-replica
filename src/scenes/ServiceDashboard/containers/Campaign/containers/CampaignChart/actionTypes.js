import { namespace as root } from 'src/scenes/ServiceDashboard/actionTypes';

const namespace = root.fork('campaign-chart');

export const GET_CAMPAIGN_CHART = namespace.createLoadingType('getCampaignChart');
export const SELECT_CAMPAIGN_CHART = namespace.createType('selectCampaignChart');
