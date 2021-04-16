import { useCallback, useMemo } from 'react';

import {
  createFormTemplate as apiCreateFormTemplate,
  FormTemplateDto,
  FormTemplateForm,
  PositionLeadReportType,
  updateFormTemplate as apiUpdateFormTemplate,
} from '@adnz/api-ws-funnel';
import { useRequest } from '@adnz/use-request';

import { useRequestErrorNotification } from 'src/hooks/useRequestErrorNotification';
import { LeadFieldType } from '../leadFieldDefinitions';

type SaveTemplate = (
  campaignPositionId: string,
  existingTemplate?: FormTemplateDto,
  newFieldsKeys?: LeadFieldType[],
  reportType?: PositionLeadReportType,
  emails?: string[],
) => Promise<FormTemplateDto>;

type UseSaveTemplateReturn = {
  isSaving: boolean,
  saveTemplate: SaveTemplate,
};

type UseSaveTemplate = () => UseSaveTemplateReturn;

export const useSaveTemplate: UseSaveTemplate = () => {
  const [, { pending: isCreating }, createFormTemplate] = useRequest({
    apiMethod: apiCreateFormTemplate,
    runOnMount: false,
    onFail: useRequestErrorNotification(),
  });

  const [, { pending: isUpdating }, updateFormTemplate] = useRequest({
    apiMethod: apiUpdateFormTemplate,
    runOnMount: false,
    onFail: useRequestErrorNotification(),
  });

  const isSaving = useMemo<boolean>(
    () => isCreating || isUpdating,
    [isCreating, isUpdating],
  );

  const saveTemplate = useCallback<SaveTemplate>(
    (
      campaignPositionId,
      existingTemplate,
      newFieldsKeys = [],
      reportType = PositionLeadReportType.STORE,
      emails = [],
    ) => {
      if (existingTemplate) {
        const newTemplate: FormTemplateForm = {
          campaignPositionId,
          fieldsKeys: newFieldsKeys,
          emails,
          reportType,
        };
        return updateFormTemplate(newTemplate, { formTemplateId: existingTemplate.id });
      }
      return createFormTemplate({
        campaignPositionId, fieldsKeys: newFieldsKeys, emails, reportType,
      });
    },
    [updateFormTemplate, createFormTemplate],
  );

  return useMemo<UseSaveTemplateReturn>(
    () => ({ isSaving, saveTemplate }),
    [isSaving, saveTemplate],
  );
};
