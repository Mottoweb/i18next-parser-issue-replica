import { DateTimeUnixType } from '@adnz/api-helpers';
import {
  SalesPromotionDto,
  SalesPromotionForm,
  SalesPromotionPhase,
  TagType,
} from '@adnz/api-ws-funnel';
import { getValue } from 'src/components/ReactSelectV2Field';
import i18n from 'src/i18n';
import { Option } from 'src/types';

export type FormValues = {
  id?: string;
  name: string;
  description?: string;
  startDate: DateTimeUnixType;
  endDate: DateTimeUnixType;
  deadline?: DateTimeUnixType;
  status: Option<string>;
  phase?: SalesPromotionPhase;
  tags?: Array<{ label:string, value?:string, __isNew__?: boolean }>;
  revenueGoal?: number;
  contactStatuses: string[];
  typeConfigId: Option<string>;
};

export const prepareValues = (formValues: FormValues) : SalesPromotionForm => (
  {
    ...formValues,
    name: formValues.name ? formValues.name : '',
    startDate: formValues.startDate,
    endDate: formValues.endDate,
    typeConfigId: getValue(formValues?.typeConfigId),
    status: getValue(formValues?.status),
    goals: [{ name: 'revenue', goal: formValues.revenueGoal }],
    tags: formValues.tags ? formValues.tags.map((tag) => ({
      // eslint-disable-next-line no-underscore-dangle
      id: tag.__isNew__ ? undefined : tag.value,
      active: true,
      type: TagType.SALESFUNNEL,
      name: tag.label,
    })) : [],
  }
);

export const prepareInitialValues = (
  promotion: SalesPromotionDto,
) : FormValues => ({
  ...promotion,
  startDate: promotion.startDate,
  endDate: promotion.endDate,
  deadline: promotion.deadline,
  revenueGoal: promotion.goals.filter((g) => g.name === 'revenue')[0]?.goal,
  typeConfigId: { value: promotion.typeConfig.id, label: promotion.typeConfig.name },
  status: { value: promotion.status, label: i18n.t(promotion.status) },
  tags: promotion.tags.map((tag) => ({ label: tag.name, value: tag.id })),
});
