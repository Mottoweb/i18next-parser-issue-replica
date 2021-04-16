import React, { useCallback, useMemo, useState } from 'react';
import { Col, Container, Row } from 'styled-bootstrap-grid';
import {
  Button, Checkbox, Label, Modal, Select,
} from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import { FormTemplateDto, getPositionLeadReportTypes, PositionLeadReportType } from '@adnz/api-ws-funnel';
import notify from 'src/modules/Notification';
import { useRequest } from '@adnz/use-request';
import { Option } from 'src/types';
import { isOption } from 'src/typeGuards';
import { useTranslateOptionLabel } from 'src/hooks/useTranslateOptionLabel';
import { CreatableInput } from 'src/components/CreatableInput';
import { useSaveTemplate } from '../hooks/useSaveTemplate';
import { leadFieldDefinitions, LeadFieldType } from '../leadFieldDefinitions';

import { LeadsEditorCheckboxRow } from '../styles';

interface FlightLeadsEditorProps {
  campaignPositionId: string;
  template?: FormTemplateDto;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const useFlightLeadsEditor = (template?: FormTemplateDto) => {
  // Checkboxes
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<LeadFieldType[]>(
    template?.fieldsKeys as LeadFieldType[] || [],
  );

  const toggleFieldCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checkbox = e.currentTarget.id as LeadFieldType;
      setSelectedCheckboxes(
        (state) => (state.includes(checkbox) ? state.filter((item) => item !== checkbox) : [...state, checkbox]),
      );
    },
    [setSelectedCheckboxes],
  );

  // Report types
  const [availableReportTypes] = useRequest({
    apiMethod: getPositionLeadReportTypes,
    defaultData: [] as PositionLeadReportType[],
  });

  const reportTypeOptions: Option<PositionLeadReportType>[] = useMemo(
    () => availableReportTypes.map(
      (type: PositionLeadReportType) => ({ label: `REPORT_TYPE_${type}`, value: type }),
    ), [availableReportTypes],
  );

  const [selectedReportType, setReportType] = useState<PositionLeadReportType>(
    template?.reportType || PositionLeadReportType.STORE,
  );

  const selectedReportTypeOption = useMemo(() => reportTypeOptions.find(
    ({ value }) => value === selectedReportType,
  ), [selectedReportType, reportTypeOptions]);

  const setSelectedReportTypeOption = useCallback((option: unknown) => {
    if (isOption<PositionLeadReportType>(option)) {
      setReportType(option.value);
    }
  }, [setReportType]);

  // Emails

  const [emails, setEmails] = useState<string[]>(template?.emails || []);

  return {
    selectedCheckboxes,
    reportTypeOptions,
    setSelectedReportTypeOption,
    selectedReportType,
    selectedReportTypeOption,
    toggleFieldCheckbox,
    emails,
    setEmails,
  };
};

export const FlightLeadsEditor: React.FC<FlightLeadsEditorProps> = ({
  onClose, onSaveSuccess, campaignPositionId, template,
}) => {
  const { t } = useTranslation(['translation', 'common', 'serviceDashboard']);
  const translateOptionLabel = useTranslateOptionLabel(t);

  const {
    selectedCheckboxes, reportTypeOptions, setSelectedReportTypeOption, selectedReportTypeOption,
    selectedReportType, toggleFieldCheckbox, emails, setEmails,
  } = useFlightLeadsEditor(template);

  const { isSaving, saveTemplate } = useSaveTemplate();

  const saveTemplateAndClose = useCallback(async () => {
    try {
      const savedTemplate = await saveTemplate(
        campaignPositionId, template, selectedCheckboxes, selectedReportType, emails,
      );
      if (savedTemplate) {
        onClose();
        onSaveSuccess();
      }
    } catch (e) {
      notify.danger(t('serviceDashboard:ERROR'), t(e?.response?.data?.message || 'UNKNOWN_ERROR'));
    }
  }, [
    onSaveSuccess, saveTemplate, campaignPositionId, template, onClose, t,
    selectedCheckboxes, emails, selectedReportType,
  ]);

  return (
    <Modal
      isOpen
      title={template ? t('serviceDashboard:EDIT_TEMPLATE') : t('serviceDashboard:CREATE_TEMPLATE')}
      onRequestClose={onClose}
    >
      <Modal.Body>
        <Container>
          <Row css="margin-bottom: 15px;">
            <Col md={4}>
              <Label>{t('serviceDashboard:REPORT_TYPE')}</Label>
              <Select<Option<PositionLeadReportType>, false>
                options={reportTypeOptions}
                value={selectedReportTypeOption}
                formatOptionLabel={translateOptionLabel}
                onChange={setSelectedReportTypeOption}
              />
            </Col>
            {selectedReportType === PositionLeadReportType.MAIL && (
              <Col md={8}>
                <Label>{t('serviceDashboard:EMAILS')}</Label>
                <CreatableInput value={emails} onChange={setEmails} />
              </Col>
            )}
          </Row>
          <Row>
            <Col md={12}>
              <Label>{t('serviceDashboard:FIELDS')}</Label>
              {leadFieldDefinitions.map((definition) => (
                <LeadsEditorCheckboxRow>
                  <Checkbox
                    checked={selectedCheckboxes.includes(definition.type)}
                    onChange={toggleFieldCheckbox}
                    id={definition.type}
                  />
                  <span>{t(definition.label)}</span>
                  <i>{`(${definition.type})`}</i>
                </LeadsEditorCheckboxRow>
              ))}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          css="width: 130px; margin-left: auto;"
          onClick={saveTemplateAndClose}
          isLoading={isSaving}
        >
          {template ? t('serviceDashboard:SAVE') : t('serviceDashboard:CREATE')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
