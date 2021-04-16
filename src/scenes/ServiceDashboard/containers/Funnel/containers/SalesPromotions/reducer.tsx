import { combineReducers } from 'redux';
import { ActionType, createReducer, StateType } from 'typesafe-actions';
import {
  SalesPromotionFilter,
  getSalesPromotionsTypeConfigsParameters,
  SalesPromotionDto,
  SalesPromotionAccount,
  SalesPromotionContact,
  SalesPromotionTypeConfig,
} from '@adnz/api-ws-funnel';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import * as actions from './actions';

const promotions = createReducer<SalesPromotionDto[], ActionType<typeof actions>>([])
  .handleAction(
    actions.SAVE_PROMOTION_PAGE,
    (state, action) => {
      const { items } = action.payload;
      const filtered = items.filter((item: SalesPromotionDto) => !state.map((i) => i.id).includes(item.id));
      return [...state, ...filtered];
    },
  ).handleAction(
    [actions.SAVE_PROMOTION, actions.UPDATE_PROMOTION],
    (state, action) => {
      const promotion = action.payload;
      const filtered = state.filter((item) => item.id !== promotion.id);
      return [promotion, ...filtered];
    },
  )
  .handleAction(
    [
      actions.SET_SALES_PROMOTION_FILTER, actions.SAVE_PROMOTION_DETAILS, actions.SET_SEARCH_FILTER,
      actions.SET_FILTERS,
    ],
    () => [],
  );

const promotionDetails = createReducer<SalesPromotionDto | null, ActionType<typeof actions>>(null)
  .handleAction(
    [actions.SAVE_PROMOTION_DETAILS, actions.UPDATE_PROMOTION],
    (state, action) => action.payload,
  );

const accounts = createReducer<SalesPromotionAccount[], ActionType<typeof actions>>([])
  .handleAction(
    [actions.SAVE_PROMOTION_DETAILS, actions.UPDATE_PROMOTION],
    (state, action) => action.payload.accounts,
  ).handleAction(
    actions.SAVE_PROMOTION_TASK,
    (state, action) => {
      const { accountId, task } = action.payload;
      return state.map((account) => {
        if (account.accountId === accountId) {
          return { ...account, task };
        }
        return account;
      });
    },
  );

const orders = createReducer<CampaignDto[], ActionType<typeof actions>>([])
  .handleAction(
    actions.SAVE_CAMPAIGNS,
    (state, action) => (action.payload.isOrder ? action.payload.campaigns : state),
  ).handleAction(
    actions.SAVE_PROMOTION_DETAILS,
    () => [],
  ).handleAction(
    actions.REMOVE_CAMPAIGNS,
    (state, action) => {
      if (!action.payload.isOrder) return state;
      const ids = action.payload.selectedCampaignIds;
      return state.filter((item) => !ids.includes(item.campaignId));
    },
  );

const offers = createReducer<CampaignDto[], ActionType<typeof actions>>([])
  .handleAction(
    actions.SAVE_CAMPAIGNS,
    (state, action) => (action.payload.isOrder ? state : action.payload.campaigns),
  ).handleAction(
    actions.SAVE_PROMOTION_DETAILS,
    () => [],
  ).handleAction(
    actions.REMOVE_CAMPAIGNS,
    (state, action) => {
      if (action.payload.isOrder) return state;
      const ids = action.payload.selectedCampaignIds;
      return state.filter((item) => !ids.includes(item.campaignId));
    },
  );

const contacts = createReducer<SalesPromotionContact[], ActionType<typeof actions>>([])
  .handleAction(
    [actions.SAVE_PROMOTION_DETAILS, actions.UPDATE_PROMOTION],
    (state, action) => action.payload.contacts,
  );

const typeConfigs = createReducer<SalesPromotionTypeConfig[], ActionType<typeof actions>>([])
  .handleAction(
    actions.SAVE_TYPE_CONFIGS_PAGE,
    (state, action) => {
      const { items } = action.payload;
      const filtered = items.filter((item: SalesPromotionTypeConfig) => !state.map((i) => i.id).includes(item.id));
      return [...state, ...filtered];
    },
  ).handleAction(
    actions.SAVE_TYPE_CONFIG,
    (state, action) => {
      const typeConfig = action.payload;
      const filtered = state.filter((item) => item.id !== typeConfig.id);
      return [typeConfig, ...filtered];
    },
  ).handleAction(
    [actions.SET_SEARCH_FILTER, actions.SET_FILTERS],
    () => [],
  )
  .handleAction(
    actions.SET_TYPE_CONFIG_FILTER,
    () => [],
  );

const total = createReducer<number, ActionType<typeof actions>>(0)
  .handleAction(
    actions.SAVE_PROMOTION_PAGE,
    (state, action) => action.payload.total,
  ).handleAction(
    actions.SAVE_PROMOTION,
    (state) => state + 1,
  ).handleAction(
    actions.SET_SEARCH_FILTER,
    () => 0,
  )
  .handleAction(
    actions.SET_FILTERS,
    () => 0,
  )
  .handleAction(
    [actions.SET_SALES_PROMOTION_FILTER, actions.SAVE_PROMOTION_DETAILS],
    () => 0,
  );

const typeConfigsTotal = createReducer<number, ActionType<typeof actions>>(0)
  .handleAction(
    actions.SAVE_TYPE_CONFIGS_PAGE,
    (state, action) => action.payload.total,
  ).handleAction(
    actions.SET_SEARCH_FILTER,
    () => 0,
  ).handleAction(
    actions.SET_TYPE_CONFIG_FILTER,
    () => 0,
  );

const searchFilter = createReducer<string, ActionType<typeof actions>>('')
  .handleAction(
    actions.SET_SEARCH_FILTER,
    (state, action) => action.payload,
  );

const selectedAccountIds = createReducer<string[], ActionType<typeof actions>>([])
  .handleAction(
    actions.SELECT_ACCOUNT,
    (state, action) => (action.payload.isRemove
      ? state.filter((id) => action.payload.id !== id)
      : [...state, action.payload.id]),
  ).handleAction(
    actions.SELECT_ACCOUNTS,
    (state, action) => (action.payload.isRemove
      ? state.filter((id) => !action.payload.ids.includes(id))
      : action.payload.ids),
  );

const selectedContactIds = createReducer<string[], ActionType<typeof actions>>([])
  .handleAction(
    actions.SELECT_CONTACT,
    (state, action) => (action.payload.isRemove
      ? state.filter((id) => action.payload.id !== id)
      : [...state, action.payload.id]),
  ).handleAction(
    actions.OPEN_EDIT_CONTACT,
    (state, action) => [action.payload],
  ).handleAction(
    actions.SELECT_CONTACTS,
    (state, action) => (action.payload.isRemove
      ? state.filter((id) => !action.payload.ids.includes(id))
      : action.payload.ids),
  );

const selectedOrderIds = createReducer<string[], ActionType<typeof actions>>([])
  .handleAction(
    actions.SELECT_CAMPAIGN,
    (state, action) => {
      if (!action.payload.isOrder) return state;
      return action.payload.isRemove
        ? state.filter((id) => action.payload.id !== id)
        : [...state, action.payload.id];
    },
  ).handleAction(
    actions.REMOVE_CAMPAIGNS,
    (state, action) => (!action.payload.isOrder ? state : []),
  ).handleAction(
    actions.SELECT_CAMPAIGNS,
    (state, action) => {
      if (!action.payload.isOrder) return state;
      return action.payload.isRemove
        ? state.filter((id) => !action.payload.ids.includes(id))
        : action.payload.ids;
    },
  );

const selectedOfferIds = createReducer<string[], ActionType<typeof actions>>([])
  .handleAction(
    actions.SELECT_CAMPAIGN,
    (state, action) => {
      if (action.payload.isOrder) return state;
      return action.payload.isRemove
        ? state.filter((id) => action.payload.id !== id)
        : [...state, action.payload.id];
    },
  ).handleAction(
    actions.REMOVE_CAMPAIGNS,
    (state, action) => (action.payload.isOrder ? state : []),
  ).handleAction(
    actions.SELECT_CAMPAIGNS,
    (state, action) => {
      if (action.payload.isOrder) return state;
      return action.payload.isRemove
        ? state.filter((id) => !action.payload.ids.includes(id))
        : action.payload.ids;
    },
  );

const statusFilter = createReducer<string | null, ActionType<typeof actions>>(null)
  .handleAction(
    actions.SET_FILTERS,
    (state, action) => action.payload.statusFilter,
  );

const phaseFilter = createReducer<string | null, ActionType<typeof actions>>(null)
  .handleAction(
    actions.SET_FILTERS,
    (state, action) => action.payload.phaseFilter,
  );

const includeInactiveFilter = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.SET_FILTERS,
    (state, action) => !!action.payload.includeInactive,
  );

const isTypeConfigModalOpened = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.OPEN_TYPE_CONFIG_MODAL,
    () => true,
  ).handleAction(
    actions.OPEN_EDIT_TYPE_CONFIG,
    () => true,
  ).handleAction(
    actions.SAVE_TYPE_CONFIG,
    () => false,
  )
  .handleAction(
    actions.CLOSE_MODAL,
    () => false,
  );

const isPromotionModalOpened = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.OPEN_PROMOTION_MODAL,
    () => true,
  ).handleAction(
    actions.OPEN_EDIT_PROMOTION,
    () => true,
  )
  .handleAction(
    [actions.SAVE_PROMOTION, actions.UPDATE_PROMOTION, actions.CLOSE_MODAL],
    () => false,
  );

const isAddAccountsModalOpened = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.OPEN_ADD_ACCOUNTS,
    () => true,
  )
  .handleAction(
    [actions.SAVE_PROMOTION, actions.UPDATE_PROMOTION, actions.CLOSE_MODAL],
    () => false,
  );

const isAddContactsModalOpened = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.OPEN_ADD_CONTACTS,
    () => true,
  )
  .handleAction(
    [actions.SAVE_PROMOTION, actions.UPDATE_PROMOTION, actions.CLOSE_MODAL],
    () => false,
  );

const isChangeContactStatusOpened = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    [actions.OPEN_CHANGE_STATUS, actions.OPEN_EDIT_CONTACT],
    () => true,
  )
  .handleAction(
    [actions.SAVE_PROMOTION, actions.UPDATE_PROMOTION, actions.CLOSE_MODAL],
    () => false,
  );

const isAddToPromotionOpened = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.OPEN_ADD_TO_PROMOTION,
    () => true,
  )
  .handleAction(
    [actions.CLOSE_MODAL],
    () => false,
  );

const isGenerateLeadsOpened = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.OPEN_GENERATE_LEADS,
    () => true,
  )
  .handleAction(
    [actions.SAVE_PROMOTION, actions.UPDATE_PROMOTION, actions.CLOSE_MODAL],
    () => false,
  );

const editPromotionId = createReducer<string | null, ActionType<typeof actions>>(null)
  .handleAction(
    actions.OPEN_EDIT_PROMOTION,
    (state, action) => action.payload,
  ).handleAction(
    [actions.UPDATE_PROMOTION, actions.CLOSE_MODAL],
    () => null,
  );

const editTypeConfigId = createReducer<string | null, ActionType<typeof actions>>(null)
  .handleAction(
    actions.OPEN_EDIT_TYPE_CONFIG,
    (state, action) => action.payload,
  ).handleAction(
    [actions.CLOSE_MODAL, actions.SAVE_TYPE_CONFIG],
    () => null,
  );

const showAccounts = createReducer<boolean, ActionType<typeof actions>>(true)
  .handleAction(
    actions.TOGGLE_SHOW_ACCOUNTS,
    (state, action) => action.payload,
  );

const isAllAccountsShown = createReducer<boolean, ActionType<typeof actions>>(true)
  .handleAction(
    actions.TOGGLE_SHOW_ALL_ACCOUNTS,
    (state) => !state,
  ).handleAction(
    actions.TOGGLE_SHOW_ACCOUNTS,
    () => false,
  );

const isAllContactsShown = createReducer<boolean, ActionType<typeof actions>>(true)
  .handleAction(
    actions.TOGGLE_SHOW_ALL_CONTACTS,
    (state) => !state,
  ).handleAction(
    actions.TOGGLE_SHOW_ACCOUNTS,
    () => false,
  );

const isAllOrdersShown = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.TOGGLE_SHOW_ALL_ORDERS,
    (state) => !state,
  ).handleAction(
    actions.SAVE_PROMOTION_DETAILS,
    () => false,
  );

const isAllOffersShown = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.TOGGLE_SHOW_ALL_OFFERS,
    (state) => !state,
  ).handleAction(
    actions.SAVE_PROMOTION_DETAILS,
    () => false,
  );

const isAllDocumentsShown = createReducer<boolean, ActionType<typeof actions>>(false)
  .handleAction(
    actions.TOGGLE_SHOW_ALL_DOCUMENTS,
    (state) => !state,
  ).handleAction(
    actions.SAVE_PROMOTION_DETAILS,
    () => false,
  );

const typeConfigsParameters = createReducer<getSalesPromotionsTypeConfigsParameters, ActionType<typeof actions>>({})
  .handleAction(
    actions.HANDLE_NEXT_CONFIG_PAGE,
    ({ page, ...state }) => ({ ...state, page: (page ?? 0) + 1 }),
  )
  .handleAction(
    actions.SET_TYPE_CONFIG_FILTER,
    (state, action) => ({ ...state, ...action.payload, page: 0 }),
  )
  .handleAction(
    [actions.SET_FILTERS, actions.SET_SEARCH_FILTER],
    (state) => ({ ...state, page: 0 }),
  );

const salesPromotionParameters = createReducer<SalesPromotionFilter, ActionType<typeof actions>>({})
  .handleAction(
    actions.HANDLE_NEXT_PROMOTION_PAGE,
    ({ page, ...state }) => ({ ...state, page: (page ?? 0) + 1 }),
  )
  .handleAction(
    actions.SET_SALES_PROMOTION_FILTER,
    (state, action) => ({ ...state, ...action.payload, page: 0 }),
  )
  .handleAction(
    [actions.SAVE_PROMOTION_DETAILS, actions.SET_FILTERS, actions.SET_SEARCH_FILTER],
    (state) => ({ ...state, page: 0 }),
  );

const reducer = combineReducers({
  promotions,
  typeConfigs,
  total,
  typeConfigsTotal,
  searchFilter,
  statusFilter,
  phaseFilter,
  isTypeConfigModalOpened,
  editPromotionId,
  isPromotionModalOpened,
  showAccounts,
  editTypeConfigId,
  accounts,
  contacts,
  selectedAccountIds,
  selectedContactIds,
  selectedOrderIds,
  selectedOfferIds,
  isAddAccountsModalOpened,
  isAddContactsModalOpened,
  isAllContactsShown,
  isAllAccountsShown,
  isChangeContactStatusOpened,
  isAddToPromotionOpened,
  offers,
  orders,
  isAllOrdersShown,
  isAllOffersShown,
  isAllDocumentsShown,
  isGenerateLeadsOpened,
  typeConfigsParameters,
  salesPromotionParameters,
  promotionDetails,
  includeInactiveFilter,
});

export const initialState: StateType<typeof reducer> = {
  promotions: [],
  typeConfigs: [],
  accounts: [],
  contacts: [],
  selectedAccountIds: [],
  selectedContactIds: [],
  selectedOrderIds: [],
  selectedOfferIds: [],
  total: 0,
  typeConfigsTotal: 0,
  searchFilter: '',
  phaseFilter: null,
  statusFilter: null,
  isTypeConfigModalOpened: false,
  isPromotionModalOpened: false,
  isAddAccountsModalOpened: false,
  isAddContactsModalOpened: false,
  isGenerateLeadsOpened: false,
  isChangeContactStatusOpened: false,
  isAddToPromotionOpened: false,
  offers: [],
  orders: [],
  isAllOrdersShown: false,
  isAllOffersShown: false,
  isAllDocumentsShown: false,
  isAllAccountsShown: false,
  isAllContactsShown: false,
  showAccounts: true,
  editPromotionId: null,
  editTypeConfigId: null,
  promotionDetails: null,
  includeInactiveFilter: false,
  typeConfigsParameters: {
    page: 0,
    limit: 10,
    sort: 'name',
    order: 'ASC',
  },
  salesPromotionParameters: {
    page: 0,
    limit: 10,
    sort: 'name',
    order: 'ASC',
  },
};

export default reducer;
