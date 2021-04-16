import {
  TaskBatchForm,
  TagType,
} from '@adnz/api-ws-funnel';
import { getValue } from 'src/components/ReactSelectV2Field';
import { Option } from 'src/types';

export type FormValues = {
  accountIds: string[];
  salesPromotionId: string;
  message?: string;
  isImportant?: boolean;
  assignToDefaultSalesContact: boolean;
  priority: Option<string>;
  assignee?: Option<string>;
  leadSource: Option<string>;
  tags?: Array<{ label:string, value?:string, __isNew__?: boolean }>;
};

export const prepareValues = (formValues: FormValues) : TaskBatchForm => (
  {
    salesPromotionId: formValues.salesPromotionId,
    accountIds: formValues.accountIds,
    assignToDefaultSalesContact: formValues.assignToDefaultSalesContact,
    task: {
      salesPromotionId: formValues.salesPromotionId,
      isImportant: formValues.isImportant,
      leadSource: { id: getValue(formValues.leadSource) },
      assignee: { id: getValue(formValues.assignee) },
      priority: getValue(formValues.priority),
      activity: { message: formValues.message || '' },
      tags: formValues.tags ? formValues.tags.map((tag) => ({
        // eslint-disable-next-line no-underscore-dangle
        id: tag.__isNew__ ? undefined : tag.value,
        active: true,
        type: TagType.SALESFUNNEL,
        name: tag.label,
      })) : [],
    },
  }
);

export const priorityOptions = [
  { value: 'LOW', label: 'LOW' },
  { value: 'MEDIUM', label: 'MEDIUM' },
  { value: 'HIGH', label: 'HIGH' },
];
