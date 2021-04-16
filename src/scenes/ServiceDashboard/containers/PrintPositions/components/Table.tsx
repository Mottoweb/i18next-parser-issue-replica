import React from 'react';
import { Container } from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import { Table as UITable } from '@adnz/ui';
import InfiniteScroll from 'src/modules/InfiniteScroll';
import { usePrintPositionsContext } from '../Context';
import Row from './Row';

const Table: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [{
    items,
    total,
    hasMore,
    loading,
  }, { next, sortOrder }] = usePrintPositionsContext();

  return (
    <Container>
      <InfiniteScroll
        next={next}
        hasMore={hasMore}
        loading={loading}
        dataLength={items.length}
      >
        <UITable>
          <thead>
            <UITable.Tr>
              <UITable.Th {...sortOrder('name')}>{t('serviceDashboard:CAMPAIGN')}</UITable.Th>
              <UITable.Th>{t('serviceDashboard:CHIFFRE')}</UITable.Th>
              <UITable.Th {...sortOrder('publicationDate')}>{t('serviceDashboard:PUBLICATION_DATE')}</UITable.Th>
              <UITable.Th>{t('serviceDashboard:PRODUCTION_SIZE')}</UITable.Th>
              <UITable.Th {...sortOrder('color')}>{t('serviceDashboard:COLOR')}</UITable.Th>
              <UITable.Th {...sortOrder('amountNet4')}>{t('serviceDashboard:AMOUNT')}</UITable.Th>
            </UITable.Tr>
          </thead>
          {!loading && items.length === 0 && (
            <UITable.TableInfo>
              {t('serviceDashboard:THERE_ARE_NO_ENTRIES')}
            </UITable.TableInfo>
          )}
          {items.map((position) => <Row key={position.id} position={position} />)}
          {loading && (<UITable.Loader columnsLength={5} />)}
        </UITable>
      </InfiniteScroll>
      <UITable.Footer total={total} current={items.length} />
    </Container>
  );
};

export default Table;
