import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader, Button, DropdownList } from '@adnz/ui';
import { getFormTemplateByCampaignPositionId, deleteFormTemplate } from '@adnz/api-ws-funnel';
import { useRequest } from '@adnz/use-request';
import confirmAlert from 'src/components/confirmAlert';
import { LeadsTableContainer } from './styles';

import { FlightLeadsInfoModal } from './components/FlightLeadsInfoModal';
import { FlightLeadsEditor } from './components/FlightLeadsEditor';
import { FlightLeadsTable } from './components/FlightLeadsTable';

interface FlightLeadsProps {
  campaignPositionId: string;
}

export const FlightLeads: React.FC<FlightLeadsProps> = ({ campaignPositionId }) => {
  const { t } = useTranslation(['translation', 'common', 'serviceDashboard']);

  const [template, { pending: templateIsLoading }, loadTemplate] = useRequest({
    apiMethod: getFormTemplateByCampaignPositionId,
    parameters: [{ campaignPositionId }],
  });

  const [,, deleteTemplate] = useRequest({
    apiMethod: deleteFormTemplate,
    runOnMount: false,
  });

  const reloadCurrentTemplate = useCallback(
    () => loadTemplate({ campaignPositionId }), [loadTemplate, campaignPositionId],
  );

  const [infoShown, setInfoShown] = useState<boolean>(false);
  const toggleTemplateInfo = useCallback(() => setInfoShown((state) => !state), [setInfoShown]);

  const [editorShown, setEditorShown] = useState<boolean>(false);

  const showEditor = useCallback(() => setEditorShown(true), [setEditorShown]);
  const hideEditor = useCallback(() => setEditorShown(false), [setEditorShown]);

  const handleSaveSuccess = useCallback(() => {
    reloadCurrentTemplate();
    setEditorShown(false);
  }, [setEditorShown, reloadCurrentTemplate]);

  const confirmTemplateDelete = useCallback(() => {
    confirmAlert({
      title: t('serviceDashboard:DELETE_TEMPLATE'),
      message: t('serviceDashboard:DELETE_TEMPLATE_CONFIRMATION'),
      buttons: [
        {
          label: t('serviceDashboard:BUTTON_CONFIRM'),
          onClick: async (close) => {
            if (template) {
              await deleteTemplate({ formTemplateId: template.id });
            }
            close();
            reloadCurrentTemplate();
          },
        },
      ],
      closeText: t('serviceDashboard:BUTTON_CANCEL'),
    });
  }, [t, deleteTemplate, reloadCurrentTemplate, template]);

  const dropdownElement = useMemo(() => (
    <DropdownList theme="create" inThead>
      <DropdownList.Item onClick={showEditor} children={t('serviceDashboard:EDIT_TEMPLATE')} />
      <DropdownList.Item onClick={toggleTemplateInfo} children={t('serviceDashboard:INFORMATION')} />
      <DropdownList.Item onClick={confirmTemplateDelete} children={t('serviceDashboard:DELETE_TEMPLATE')} />
    </DropdownList>
  ), [confirmTemplateDelete, toggleTemplateInfo, showEditor, t]);

  return (
    <LeadsTableContainer>
      {templateIsLoading
        ? <Loader />
        : (
          <>
            { template ? (
              <FlightLeadsTable
                template={template}
                dropdownElement={dropdownElement}
              />
            ) : (
              <Button onClick={showEditor}>
                {t('serviceDashboard:CREATE_TEMPLATE')}
              </Button>
            )}
            { editorShown && (
              <FlightLeadsEditor
                campaignPositionId={campaignPositionId}
                template={template}
                onClose={hideEditor}
                onSaveSuccess={handleSaveSuccess}
              />
            )}
            { infoShown && template && (
              <FlightLeadsInfoModal onClose={toggleTemplateInfo} formTemplateId={template.id} />
            )}
          </>
        )}
    </LeadsTableContainer>
  );
};
