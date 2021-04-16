import React from 'react';
import {
  useTranslation,
} from 'react-i18next';
import { Container } from 'styled-bootstrap-grid';
import { useRequest } from '@adnz/use-request';
import {
  getSalesPromotionsTypeConfigs,
  getSalesPromotionsTypeConfigsParameters,
} from '@adnz/api-ws-funnel';
import { Button, Table, PageHeader } from '@adnz/ui';
import InfiniteScroll from 'src/modules/InfiniteScroll';
import useSortAndOrder from 'src/hooks/useSortAndOrder';
import Filter from '../Filter';
import * as actions from '../actions';
import {
  useDispatch,
  useSelector,
} from '../context';
import TypeConfigRow from './TypeConfigRow';
import TypeConfigForm from './TypeConfigForm';

import * as selectors from '../selectors';

const TypeConfigs: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  const dispatch = useDispatch();

  const typeConfigs = useSelector(selectors.getTypeConfigs, []);
  const total = useSelector(selectors.getTotalTypeConfigs, []);
  const sortParameters = useSelector(selectors.getTypeConfigsSortParameters, []);
  const searchFilter = useSelector(selectors.getSearchFilter, []);
  const includeInactive = useSelector(selectors.getIncludeInactiveFilter, []);
  const parameters = { ...sortParameters, searchFilter, includeInactive };
  const openModal = () => dispatch(actions.OPEN_TYPE_CONFIG_MODAL());
  const handleNext = () => dispatch(actions.HANDLE_NEXT_CONFIG_PAGE());
  const setFilter = (value: getSalesPromotionsTypeConfigsParameters) => dispatch(actions.SET_TYPE_CONFIG_FILTER(value));

  const {
    getHandleChangeArgument,
    getOrderArgument,
  } = useSortAndOrder<getSalesPromotionsTypeConfigsParameters>(parameters, setFilter);

  const [, { pending }] = useRequest({
    apiMethod: getSalesPromotionsTypeConfigs,
    runOnMount: true,
    parameters: [{ ...parameters }],
    onSuccess: React.useCallback(
      (data) => {
        dispatch(actions.SAVE_TYPE_CONFIGS_PAGE(data));
      },
      [dispatch],
    ),
  });

  return (
    <>
      <PageHeader
        title={t('serviceDashboard:TYPE_CONFIGS')}
        actions={(<Button onClick={openModal} id="create-button">{t('serviceDashboard:CREATE_TYPE_CONFIG')}</Button>)}
      >
        <Filter hideStatusAndPhase />
      </PageHeader>
      <TypeConfigForm />
      <Container>
        <>
          <InfiniteScroll
            next={handleNext}
            hasMore={typeConfigs.length < total}
            loading={pending}
            dataLength={typeConfigs.length}
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
                    order={getOrderArgument('active')}
                    handleChangeOrder={getHandleChangeArgument('active')}
                  >
                    {t('serviceDashboard:ACTIVE')}
                  </Table.Th>
                  <Table.Th />
                </Table.Tr>
              </thead>
              {!pending && typeConfigs.length === 0 && (
                <Table.TableInfo>
                  {t('serviceDashboard:THERE_ARE_NO_ENTRIES')}
                </Table.TableInfo>
              )}
              {typeConfigs.length !== 0 && (
                <tbody data-testid="sales-promotion-type-configs-table-body">
                  {typeConfigs.map((item, index) => (
                    <TypeConfigRow
                      key={item.id}
                      typeConfig={item}
                      index={index}
                    />
                  ))}
                </tbody>
              )}
              {pending && (
                <Table.Loader
                  columnsLength={3}
                />
              )}
            </Table>
          </InfiniteScroll>
          <Table.Footer total={total} current={typeConfigs.length} />
        </>
      </Container>
    </>
  );
};

export default TypeConfigs;
