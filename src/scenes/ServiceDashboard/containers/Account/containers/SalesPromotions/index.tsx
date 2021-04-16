import React, { useCallback, useEffect, useState } from 'react';
import {
  useTranslation,
} from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import {
  getSalesPromotions,
  SalesPromotionFilter,
  SalesPromotionDto,
} from '@adnz/api-ws-funnel';
import { Table, Button } from '@adnz/ui';
import { Container, Row } from 'styled-bootstrap-grid';
import SectionTitle from 'src/components/SectionTitle';
import InfiniteScroll from 'src/modules/InfiniteScroll';
import { useSortAndOrderState } from 'src/hooks/useSortAndOrderState';
import { useRequestErrorNotification } from 'src/hooks/useRequestErrorNotification';
import PromotionRow from './Row';
import AddPromotionForm from './AddPromotionForm';

interface PromotionListParams {
  accountId: string;
}

const PromotionList: React.FC<PromotionListParams> = ({ accountId }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [opened, setOpened] = React.useState<boolean>(false);
  const { sortProps, sortParameters } = useSortAndOrderState<keyof SalesPromotionDto>('name');

  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentItems, setCurrentItems] = useState<SalesPromotionDto[]>([]);
  const [page, setPage] = useState<number>(0);
  const loadNextPage = useCallback(() => setPage((p) => p + 1), [setPage]);

  const hasMore = React.useMemo<boolean>(() => currentItems.length < totalItems,
    [currentItems, totalItems]);

  const [, { pending }, getItems] = useRequest({
    apiMethod: getSalesPromotions,
    debounce: 500,
    runOnMount: false,
    onFail: useRequestErrorNotification(),
  });

  const loadItems = useCallback(
    async (usedParameters: SalesPromotionFilter, appendToLoadedList = false) => {
      const loadedItems = await getItems(usedParameters);
      if (loadedItems) {
        const { items, total } = loadedItems;
        setTotalItems(total);
        if (appendToLoadedList) {
          setCurrentItems((state) => [...state, ...items]);
        } else {
          setCurrentItems(items);
        }
      }
    }, [getItems, setCurrentItems, setTotalItems],
  );

  const resetItemsState = useCallback(() => {
    setCurrentItems([]);
    setTotalItems(0);
    setPage(0);
  }, []);

  const loadCurrentItems = useCallback(() => {
    loadItems({
      page,
      ...sortParameters,
      accountId,
    }, true);
  }, [loadItems, page, sortParameters, accountId]);

  const resetItems = useCallback(() => {
    resetItemsState();
    loadCurrentItems();
  }, [resetItemsState, loadCurrentItems]);

  // Clearing items when filter or whatever had changed
  useEffect(resetItemsState, [resetItemsState, sortParameters]);

  // Loading new items and appending them to existing for current page when parameters had changed
  useEffect(loadCurrentItems, [loadCurrentItems, page, sortParameters]);

  return (
    <>
      <AddPromotionForm accountId={accountId} opened={opened} setOpened={setOpened} resetItems={resetItems} />
      <div className="flex-page">
        <SectionTitle>
          <span>{t('serviceDashboard:SALES_PROMOTIONS')}</span>
          <Button onClick={() => setOpened(true)} id="create-button">{t('serviceDashboard:ADD_ACCOUNT_TO_PROMOTION')}</Button>
        </SectionTitle>

        <Row>
          <Container>
            <>
              <InfiniteScroll
                next={loadNextPage}
                hasMore={hasMore}
                loading={pending}
                dataLength={currentItems.length}
              >
                <Table>
                  <thead>
                    <Table.Tr>
                      <Table.Th
                        css="width: 100%;"
                        {...sortProps('name')}
                      >
                        {t('serviceDashboard:NAME')}
                      </Table.Th>
                      <Table.Th>
                        {t('serviceDashboard:PHASE')}
                      </Table.Th>
                      <Table.Th
                        {...sortProps('startDate')}
                      >
                        {t('serviceDashboard:START_DATE')}
                      </Table.Th>
                      <Table.Th
                        {...sortProps('endDate')}
                      >
                        {t('serviceDashboard:END_DATE')}
                      </Table.Th>
                      <Table.Th
                        {...sortProps('deadline')}
                      >
                        {t('serviceDashboard:DEADLINE')}
                      </Table.Th>
                      <Table.Th />
                    </Table.Tr>
                  </thead>
                  {currentItems.length > 0 && (
                  <tbody data-testid="sales-promotion-type-configs-table-body">
                    {currentItems.map((item, index) => (
                      <PromotionRow
                        key={item.id}
                        salesPromotion={item}
                        index={index}
                        resetItems={resetItems}
                        accountId={accountId}
                      />
                    ))}
                  </tbody>
                  )}
                  {!pending && currentItems.length === 0 && (
                    <Table.TableInfo dataTestId="there-are-no-entries-title">
                      {t('serviceDashboard:THERE_ARE_NO_ENTRIES')}
                    </Table.TableInfo>
                  )}
                  {pending && (
                    <Table.Loader
                      columnsLength={6}
                    />
                  )}
                </Table>
              </InfiniteScroll>
              <Table.Footer total={totalItems} current={currentItems.length} />
            </>
          </Container>
        </Row>
      </div>
    </>
  );
};

export default PromotionList;
