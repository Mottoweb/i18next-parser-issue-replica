import React from 'react';
import {
  useTranslation,
} from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import {
  getSalesPromotions,
  SalesPromotionFilter,
} from '@adnz/api-ws-funnel';
import { Button, Table, PageHeader } from '@adnz/ui';
import { Container, Row } from 'styled-bootstrap-grid';
import InfiniteScroll from 'src/modules/InfiniteScroll';
import useSortAndOrder from 'src/hooks/useSortAndOrder';
import Filter from '../../Filter';
import * as actions from '../../actions';
import {
  useDispatch,
  useSelector,
} from '../../context';
import PromotionRow from '../PromotionRow';
import PromotionForm from '../PromotionForm';
import * as selectors from '../../selectors';

const PromotionList: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  const dispatch = useDispatch();

  const promotions = useSelector(selectors.getPromotions, []);
  const total = useSelector(selectors.getTotal, []);
  const searchFilter = useSelector(selectors.getSearchFilter, []);
  const statusFilter = useSelector(selectors.getStatusFilter, []);
  const phaseFilter = useSelector(selectors.getPhaseFilter, []);
  const sortParameters = useSelector(selectors.getSalesPromotionSortParameters, []);
  const parameters = {
    ...sortParameters, searchFilter, statusFilter, phaseFilter,
  };

  const openModal = () => dispatch(actions.OPEN_PROMOTION_MODAL());
  const handleNext = () => dispatch(actions.HANDLE_NEXT_PROMOTION_PAGE());
  const setFilter = (value: SalesPromotionFilter) => dispatch(actions.SET_SALES_PROMOTION_FILTER(value));
  const {
    getHandleChangeArgument,
    getOrderArgument,
  } = useSortAndOrder<SalesPromotionFilter>(parameters, setFilter);
  const [, { pending }] = useRequest({
    apiMethod: getSalesPromotions,
    runOnMount: true,
    parameters: [{
      status: statusFilter ?? undefined,
      phase: phaseFilter ?? undefined,
      ...parameters,
    }],
    onSuccess: React.useCallback(
      (data) => {
        dispatch(actions.SAVE_PROMOTION_PAGE(data));
      },
      [dispatch],
    ),
  });

  return (
    <>
      <PageHeader
        title={t('serviceDashboard:SALES_PROMOTIONS')}
        actions={<Button onClick={openModal} id="create-button">{t('serviceDashboard:CREATE_PROMOTION')}</Button>}
        dataTestId="sales-promotion-dropdowns"
      >
        <Filter />
      </PageHeader>
      <Container>
        <PromotionForm isDetailsOpened={false} />
        <Row>
          <Container>
            <>
              <InfiniteScroll
                next={handleNext}
                hasMore={promotions.length < total}
                loading={pending}
                dataLength={promotions.length}
              >
                <Table>
                  <thead>
                    <Table.Tr>
                      <Table.Th
                        css="width: 100%;"
                        order={getOrderArgument('name')}
                        handleChangeOrder={getHandleChangeArgument('name')}
                      >
                        {t('serviceDashboard:NAME')}
                      </Table.Th>
                      <Table.Th
                        order={getOrderArgument('salesPromotionTypeConfig.name')}
                        handleChangeOrder={getHandleChangeArgument('salesPromotionTypeConfig.name')}
                      >
                        {t('serviceDashboard:TYPE')}
                      </Table.Th>
                      <Table.Th
                        order={getOrderArgument('status')}
                        handleChangeOrder={getHandleChangeArgument('status')}
                      >
                        {t('serviceDashboard:STATUS')}
                      </Table.Th>
                      <Table.Th>
                        {t('serviceDashboard:PHASE')}
                      </Table.Th>
                      <Table.Th
                        order={getOrderArgument('startDate')}
                        handleChangeOrder={getHandleChangeArgument('startDate')}
                      >
                        {t('serviceDashboard:START_DATE')}
                      </Table.Th>
                      <Table.Th
                        order={getOrderArgument('endDate')}
                        handleChangeOrder={getHandleChangeArgument('endDate')}
                      >
                        {t('serviceDashboard:END_DATE')}
                      </Table.Th>
                      <Table.Th />
                    </Table.Tr>
                  </thead>
                  {!pending && promotions.length === 0 && (
                    <Table.TableInfo dataTestId="there-are-no-entries-title">
                      {t('serviceDashboard:THERE_ARE_NO_ENTRIES')}
                    </Table.TableInfo>
                  )}
                  {promotions.length !== 0 && (
                    <tbody data-testid="sales-promotion-type-configs-table-body">
                      {promotions.map((item, index) => (
                        <PromotionRow
                          key={item.id}
                          salesPromotion={item}
                          index={index}
                        />
                      ))}
                    </tbody>
                  )}
                  {pending && (
                    <Table.Loader
                      columnsLength={7}
                    />
                  )}
                </Table>
              </InfiniteScroll>
              <Table.Footer total={total} current={promotions.length} />
            </>
          </Container>
        </Row>
      </Container>
    </>
  );
};

export default PromotionList;
