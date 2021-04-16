import { CampaignPositionDto, getCampaignPositionsByAccountsParameters } from '@adnz/api-ws-print';

export type Getters = {
  items: CampaignPositionDto[]
  total: number
  hasMore: boolean
  loading: boolean
  parameters: getCampaignPositionsByAccountsParameters
};

export type Setters = {
  next: () => void
  sortOrder: (key: keyof CampaignPositionDto) => void
};

export type Context = [Getters, Setters];
