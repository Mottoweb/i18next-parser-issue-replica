import { StateType } from 'typesafe-actions';
import {
  SalesPromotionDto,
  SalesPromotionAccount,
  SalesPromotionTypeConfig,
  SalesPromotionContact,
  getSalesPromotionsTypeConfigsParameters,
} from '@adnz/api-ws-funnel';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import reducer from './reducer';

export const getPromotions = (
  state: StateType<typeof reducer>,
): SalesPromotionDto[] => state.promotions;

export const getTypeConfigs = (
  state: StateType<typeof reducer>,
): SalesPromotionTypeConfig[] => state.typeConfigs;

export const getTotal = (
  state: StateType<typeof reducer>,
): number => state.total;

export const getTotalTypeConfigs = (
  state: StateType<typeof reducer>,
): number => state.typeConfigsTotal;

export const getTypeConfigsSortParameters = (
  state: StateType<typeof reducer>,
): getSalesPromotionsTypeConfigsParameters => state.typeConfigsParameters;

export const getSalesPromotionSortParameters = (
  state: StateType<typeof reducer>,
): getSalesPromotionsTypeConfigsParameters => state.salesPromotionParameters;

export const getSearchFilter = (
  state: StateType<typeof reducer>,
): string => state.searchFilter;

export const getIncludeInactiveFilter = (
  state: StateType<typeof reducer>,
): boolean => state.includeInactiveFilter;

export const getPhaseFilter = (
  state: StateType<typeof reducer>,
): string | null => state.phaseFilter;

export const getStatusFilter = (
  state: StateType<typeof reducer>,
): string | null => state.statusFilter;

export const isTypeConfigModalOpened = (
  state: StateType<typeof reducer>,
): boolean => state.isTypeConfigModalOpened;

export const isPromotionModalOpened = (
  state: StateType<typeof reducer>,
): boolean => state.isPromotionModalOpened;

export const isGenerateLeadsOpened = (
  state: StateType<typeof reducer>,
): boolean => state.isGenerateLeadsOpened;

export const isAddAccountsOpened = (
  state: StateType<typeof reducer>,
): boolean => state.isAddAccountsModalOpened;

export const isAllAccountsShown = (
  state: StateType<typeof reducer>,
): boolean => state.isAllAccountsShown;

export const isAllContactsShown = (
  state: StateType<typeof reducer>,
): boolean => state.isAllContactsShown;

export const isAddContactsOpened = (
  state: StateType<typeof reducer>,
): boolean => state.isAddContactsModalOpened;

export const isChangeContactStatusOpened = (
  state: StateType<typeof reducer>,
): boolean => state.isChangeContactStatusOpened;

export const isAddToPromotionOpened = (
  state: StateType<typeof reducer>,
): boolean => state.isAddToPromotionOpened;

export const getAccounts = (
  state: StateType<typeof reducer>,
): SalesPromotionAccount[] => state.accounts;

export const getAccountIds = (
  state: StateType<typeof reducer>,
): string[] => state.accounts.map((a) => a.accountId);

export const getCampaigns = (
  state: StateType<typeof reducer>,
  isOrder: boolean,
): CampaignDto[] => (isOrder ? state.orders : state.offers);

export const getSelectedCampaigns = (
  state: StateType<typeof reducer>,
  isOrder: boolean,
): string[] => (isOrder ? state.selectedOrderIds : state.selectedOfferIds);

export const isAllCampaignsShown = (
  state: StateType<typeof reducer>,
  isOrder: boolean,
): boolean => (isOrder ? state.isAllOrdersShown : state.isAllOffersShown);

export const isAllDocumentsShown = (
  state: StateType<typeof reducer>,
): boolean => state.isAllDocumentsShown;

export const getContacts = (
  state: StateType<typeof reducer>,
): SalesPromotionContact[] => state.contacts;

export const getSelectedAccountIds = (
  state: StateType<typeof reducer>,
): string[] => state.selectedAccountIds;

export const getSelectedContactIds = (
  state: StateType<typeof reducer>,
): string[] => state.selectedContactIds;

export const getPromotionDetails = (
  state: StateType<typeof reducer>,
): SalesPromotionDto | null => state.promotionDetails;

export const getEditPromotion = (
  state: StateType<typeof reducer>,
  isDetailsOpened: boolean | undefined,
): SalesPromotionDto | undefined | null => (isDetailsOpened ? state.promotionDetails : state.promotions
  .find((p) => p.id.toString() === state.editPromotionId?.toString()));

export const getEditTypeConfig = (
  state: StateType<typeof reducer>,
): SalesPromotionTypeConfig | undefined => state.typeConfigs
  .find((p) => p.id.toString() === state.editTypeConfigId?.toString());
