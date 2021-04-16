import React from 'react';
import { useTranslation } from 'react-i18next';
import Td from 'src/components/TableV2Field/components/Td';
import TBody from 'src/components/TableV2Field/components/TBody';
import MainTable from 'src/components/TableV2Field/components/Table';
import PrintValue from 'src/scenes/ServiceDashboard/containers/History/PrintValue';
import TableContentLoader from 'src/components/TableV2Field/components/TableContentLoader';
import { ActivityDto, fromDateTime } from '@adnz/api-ws-activity';
import { Th, ThSortable } from 'src/components/TableV2Field/components/Th';
import { DATE_TIME_SECONDS_FORMAT } from 'src/constants';

export interface ITable {
  data: ActivityDto[],
  order: 'ASC' | 'DESC',
  loading: boolean,
  handleChangeOrder: () => void
}

const Table: React.FC<ITable> = ({
  data,
  order,
  loading,
  handleChangeOrder,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <div className="table-container-mobile">
      <div className="table-responsive">
        <MainTable>
          <thead>
            <tr>
              <ThSortable order={order} handleChangeOrder={handleChangeOrder}>{t('serviceDashboard:DATE') as string}</ThSortable>
              <Th>{t('serviceDashboard:NAME') as string}</Th>
              <Th>{t('serviceDashboard:FIELD') as string}</Th>
              <Th>{t('serviceDashboard:OLD_VALUE') as string}</Th>
              <Th>{t('serviceDashboard:NEW_VALUE') as string}</Th>
            </tr>
          </thead>
          {loading && (
            <TableContentLoader columns={5} />
          )}
          {!loading && data.map((item) => (
            <TBody key={item.id}>
              <tr>
                <Td>{fromDateTime(item.creationDate)?.format(DATE_TIME_SECONDS_FORMAT)}</Td>
                <Td>{item.creatorName}</Td>
                <Td>
                  <PrintValue value={(item.keyValues?.find((v) => v.key === 'trigger')?.value) ?? ''} />
                </Td>
                <Td>
                  <PrintValue value={(item.keyValues?.find((v) => v.key === 'oldValue')?.value) ?? ''} />
                </Td>
                <Td>
                  <PrintValue
                    value={(item.keyValues?.find((v) => v.key === 'newValue')?.value) ?? ''}
                    trigger={item.keyValues?.find((v) => v.key === 'trigger')?.value}
                  />
                </Td>
              </tr>
            </TBody>
          ))}
        </MainTable>
      </div>
    </div>
  );
};

export default Table;
