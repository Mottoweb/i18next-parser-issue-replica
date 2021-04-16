import React, { useMemo } from 'react';
import { Table } from '@adnz/ui';
import { FormTemplateDto, FormTemplateLead, PositionLeadReportType } from '@adnz/api-ws-funnel';
import { useTranslation } from 'react-i18next';
import { FlightLeadsTableHeader } from './FlightLeadsTableHeader';
import { leadFieldDefinitions, LeadFieldType } from '../leadFieldDefinitions';
import { InTableRow } from '../styles';

interface FlightLeadsTableProps {
  template: FormTemplateDto;
  className?: string;
  dropdownElement: React.ReactNode
}

const rowHasKnownFields = (row: FormTemplateLead): boolean => leadFieldDefinitions.some(
  (field) => (row.fieldsValues as Record<LeadFieldType, any>)[field.type] !== undefined,
);

export const FlightLeadsTable: React.FC<FlightLeadsTableProps> = ({
  className,
  dropdownElement,
  template,
}) => {
  const { t } = useTranslation(['translation', 'common', 'serviceDashboard']);

  const shownFields = useMemo(
    () => leadFieldDefinitions.filter((field) => template.fieldsKeys?.includes(field.type)),
    [template],
  );

  const leadsContainKnownFieldRows = useMemo(() => {
    if (!template.formTemplateLeads || !template.formTemplateLeads.length) {
      return false;
    }
    return template.formTemplateLeads.some(rowHasKnownFields);
  }, [template]);

  const emptyTableText = useMemo(() => {
    if (!shownFields.length) return t('serviceDashboard:TEMPLATE_MISSING_COLUMNS');

    if (template.reportType === PositionLeadReportType.MAIL) {
      const hasEmails = template.emails && template.emails.length;
      return t('serviceDashboard:TEMPLATE_SENT_TO_EMAILS', { emails: hasEmails ? template.emails.join(', ') : t('serviceDashboard:TEMPLATE_NO_EMAILS') });
    }

    if (!template.formTemplateLeads || !template.formTemplateLeads.length) {
      return t('serviceDashboard:NO_DATA_FOR_TABLE');
    }
    if (!leadsContainKnownFieldRows) {
      return t('serviceDashboard:NO_KNOWN_DATA_FOR_TABLE');
    }
    return undefined;
  }, [template, t, shownFields, leadsContainKnownFieldRows]);

  return (
    <Table className={className}>
      <FlightLeadsTableHeader fields={shownFields} dropdownElement={dropdownElement} />
      <tbody>
        {emptyTableText
          ? (
            <Table.TableInfo>
              {emptyTableText}
            </Table.TableInfo>
          )
          : template.formTemplateLeads?.map((lead) => (
            rowHasKnownFields(lead)
              ? (
                <InTableRow key={lead.id}>
                  {shownFields.map((field) => (
                    <Table.Td>
                      {(lead.fieldsValues as Record<string, string>)[field.type as any]}
                    </Table.Td>
                  ))}
                  <Table.Td />
                </InTableRow>
              )
              : null
          ))}
      </tbody>
    </Table>
  );
};
