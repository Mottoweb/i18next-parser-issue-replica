import { SalesPromotionPhaseEnumValues, SalesPromotionStatusEnumValues } from '@adnz/api-ws-funnel';

export const statusOptions = SalesPromotionStatusEnumValues.map((v: string) => ({ value: v, label: v }));
export const phaseOptions = SalesPromotionPhaseEnumValues.map((v: string) => ({ value: v, label: v }));
