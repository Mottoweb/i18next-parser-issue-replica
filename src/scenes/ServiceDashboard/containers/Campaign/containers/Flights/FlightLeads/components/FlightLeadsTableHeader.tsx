import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@adnz/ui';

import { LeadFieldDefinition } from '../leadFieldDefinitions';

interface FlightLeadsTableHeaderProps {
  fields: LeadFieldDefinition[];
  dropdownElement: React.ReactNode;
}

export const FlightLeadsTableHeader:React.FC<FlightLeadsTableHeaderProps> = ({ dropdownElement, fields }) => {
  const { t } = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <thead>
      <Table.Tr>
        {fields.length
          ? fields.map((field) => (
            <Table.Th
              key={`col_${field.type}`}
            >
              {t(field.label)}
            </Table.Th>
          ))
          : <Table.Th />}
        <Table.Th css="width: 1px;">{dropdownElement}</Table.Th>
      </Table.Tr>
    </thead>
  );
};
