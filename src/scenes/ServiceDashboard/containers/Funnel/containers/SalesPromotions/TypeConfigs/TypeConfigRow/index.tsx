import React from 'react';
import { SalesPromotionTypeConfig } from '@adnz/api-ws-funnel';
import { useTranslation } from 'react-i18next';
import { Icons, Table } from '@adnz/ui';
import { useDispatch } from '../../context';
import * as actions from '../../actions';

interface TypeConfigRowItem {
  typeConfig: SalesPromotionTypeConfig,
  index: number,
}

const TypeConfigRow: React.FC<TypeConfigRowItem> = ({
  typeConfig,
  index,
}) => {
  const dispatch = useDispatch();

  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  const openEdit = () => dispatch(actions.OPEN_EDIT_TYPE_CONFIG(typeConfig.id));

  return (
    <Table.Tr key={typeConfig.id} rowIndex={index}>
      <Table.Td>{typeConfig.name}</Table.Td>
      <Table.Td>
        {typeConfig.active ? t('serviceDashboard:ACTIVE') : t('serviceDashboard:INACTIVE')}
      </Table.Td>
      <Table.Td css="width: 1px;" type="action">
        <Table.ActionsList rowIndex={index}>
          <Table.ActionsListItem
            onClick={openEdit}
            icon={(<Icons.Edit />)}
            dataTestId="edit-type-config-button"
          >
            {t('serviceDashboard:EDIT')}
          </Table.ActionsListItem>
        </Table.ActionsList>
      </Table.Td>
    </Table.Tr>
  );
};

export default TypeConfigRow;
