import { createAction } from 'typesafe-actions';
import {
  PaginatedSalesPromotion,
  SalesPromotionDto,
  PaginatedSalesPromotionTypeConfig,
  SalesPromotionTypeConfig,
  TaskDto,
  getSalesPromotionsTypeConfigsParameters,
  SalesPromotionFilter,
} from '@adnz/api-ws-funnel';
import { CampaignDto } from '@adnz/api-ws-salesforce';

export const OPEN_EDIT_PROMOTION = createAction('openEditPromotion')<string>();
export const SET_TYPE_CONFIG_FILTER = createAction('setTypeConfigFilter')<getSalesPromotionsTypeConfigsParameters>();
export const SET_SALES_PROMOTION_FILTER = createAction('setSalesPromotionFilter')<SalesPromotionFilter>();
export const OPEN_EDIT_TYPE_CONFIG = createAction('openEditTypeConfig')<string>();
export const TOGGLE_SHOW_ACCOUNTS = createAction('toggleShowAccounts')<boolean>();
export const SAVE_PROMOTION_PAGE = createAction('savePromotionPage')<PaginatedSalesPromotion>();
export const SAVE_PROMOTION = createAction('savePromotion')<SalesPromotionDto>();
export const UPDATE_PROMOTION = createAction('updatePromotion')<SalesPromotionDto>();
export const SAVE_PROMOTION_DETAILS = createAction('savePromotionDetails')<SalesPromotionDto>();
export const SET_SEARCH_FILTER = createAction('setSearchFilter')<string>();
export const SAVE_TYPE_CONFIGS_PAGE = createAction('saveTypeConfigsPage')<PaginatedSalesPromotionTypeConfig>();
export const SAVE_TYPE_CONFIG = createAction('saveTypeConfig')<SalesPromotionTypeConfig>();
export const SET_FILTERS = createAction('setFilters')<{
  phaseFilter: string | null,
  statusFilter: string | null,
  includeInactive: boolean | undefined,
}>();
export const OPEN_PROMOTION_MODAL = createAction('openPromotionModal')<undefined>();
export const OPEN_TYPE_CONFIG_MODAL = createAction('openTypeConfigModal')<undefined>();
export const HANDLE_NEXT_PROMOTION_PAGE = createAction('handleNextPromotionPage')<undefined>();
export const HANDLE_NEXT_CONFIG_PAGE = createAction('handleNextConfigPage')<undefined>();
export const CLOSE_MODAL = createAction('closeModal')<undefined>();
export const OPEN_ADD_ACCOUNTS = createAction('openAddAccounts')<undefined>();
export const OPEN_ADD_CONTACTS = createAction('openAddContacts')<undefined>();
export const OPEN_GENERATE_LEADS = createAction('openGenerateLeads')<undefined>();
export const TOGGLE_SHOW_ALL_ACCOUNTS = createAction('toggleShowAllAccounts')<undefined>();
export const TOGGLE_SHOW_ALL_CONTACTS = createAction('toggleShowAllContacts')<undefined>();
export const TOGGLE_SHOW_ALL_ORDERS = createAction('toggleShowAllOrders')<undefined>();
export const TOGGLE_SHOW_ALL_OFFERS = createAction('toggleShowAllOffers')<undefined>();
export const TOGGLE_SHOW_ALL_DOCUMENTS = createAction('toggleShowAllDocuments')<undefined>();
export const OPEN_EDIT_CONTACT = createAction('openEditContact')<string>();
export const OPEN_CHANGE_STATUS = createAction('openChangeStatus')<undefined>();
export const OPEN_ADD_TO_PROMOTION = createAction('openAddToPromotion')<undefined>();
export const SELECT_CONTACTS = createAction('selectContacts')<{ ids: string[], isRemove: boolean }>();
export const SELECT_ACCOUNTS = createAction('selectAccounts')<{ ids: string[], isRemove: boolean }>();
export const SELECT_CONTACT = createAction('selectContact')<{ id: string, isRemove: boolean }>();
export const SELECT_ACCOUNT = createAction('selectAccount')<{ id: string, isRemove: boolean }>();
export const SAVE_PROMOTION_TASK = createAction('savePromotionTask')<{ task: TaskDto, salesPromotionId: string,
  accountId: string }>();
export const SAVE_CAMPAIGNS = createAction('saveCampaigns')<{ campaigns: CampaignDto[], isOrder: boolean }>();
export const REMOVE_CAMPAIGNS = createAction('removeCampaigns')<{ selectedCampaignIds: string[], isOrder: boolean }>();
export const SELECT_CAMPAIGN = createAction('selectCampaign')<{ id: string, isOrder: boolean, isRemove: boolean }>();
export const SELECT_CAMPAIGNS = createAction('selectCampaigns')<{
  ids: string[],
  isOrder: boolean,
  isRemove: boolean,
}>();
