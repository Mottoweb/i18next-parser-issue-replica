import React from 'react';
import { useSelector } from 'react-redux';

import { DATE_ISO } from '@adnz/api-helpers';
import { useRequest } from '@adnz/use-request';
import {
  CampaignPositionDto,
  PaginatedCampaignPositions,
  getCampaignPositionsByAccounts,
  getCampaignPositionsByAccountsParameters,
} from '@adnz/api-ws-print';

import useSortAndOrder from 'src/hooks/useSortAndOrder';
import { CampaignFiltersContext, FILTER_TYPES } from 'src/modules/CampaignFilters/context';
import { getAppliedValue as getSelectedQuery } from 'src/scenes/ServiceDashboard/containers/SearchFilter/selectors';

import { Context } from './types';

const context = React.createContext<Context>([{}, {}] as Context);

export const usePrintPositionsContext = (): Context => React.useContext(context);

export interface IPrintPositionsContextProvider {
  type: string
}

export const PrintPositionsContextProvider: React.FC<IPrintPositionsContextProvider> = ({
  type,
  children,
}) => {
  const {
    filters,
    changeFilter,
    selectFilter,
    selectedFilter,
  } = React.useContext(CampaignFiltersContext);
  // @ts-expect-error Expected 1 arguments, but got 2.ts(2554)
  const searchQuery = useSelector((state) => getSelectedQuery(state, { type: 'print-positions' }));
  const [items, setItems] = React.useState<CampaignPositionDto[]>([]);
  const [sorting, setSorting] = React.useState<{ sort: keyof CampaignPositionDto, order: 'ASC' | 'DESC' }>({
    sort: 'publicationDate',
    order: 'DESC',
  });
  const [parameters, setParameters] = React.useState<getCampaignPositionsByAccountsParameters>({
    page: 0,
    type,
    limit: 15,
    ...sorting,
  });

  const { getHandleChangeArgument, getOrderArgument } = useSortAndOrder(
    sorting,
    setSorting,
  );

  const onSuccess = React.useCallback(
    (response: PaginatedCampaignPositions) => setItems((i) => [...i, ...response.items]),
    [setItems],
  );

  const [data, { pending: loading }] = useRequest({
    apiMethod: getCampaignPositionsByAccounts,
    onSuccess,
    parameters: [parameters],
    defaultData: { items: [], total: 0 } as PaginatedCampaignPositions,
  });

  const next = React.useCallback(
    () => setParameters((p) => ({ ...p, page: (p.page ?? 0) + 1 })),
    [setParameters],
  );

  const hasMore = React.useMemo<boolean>(
    () => items.length < data.total,
    [items, data],
  );

  const sortOrder = React.useCallback(
    (field: keyof CampaignPositionDto) => ({
      order: getOrderArgument(field),
      handleChangeOrder: getHandleChangeArgument(field),
    }),
    [getHandleChangeArgument, getOrderArgument],
  );

  const value = React.useMemo<Context>(
    () => [
      {
        items,
        total: data.total,
        hasMore,
        loading,
        parameters,
      },
      { next, sortOrder },
    ],
    [
      data,
      next,
      items,
      hasMore,
      loading,
      sortOrder,
      parameters,
    ],
  );

  React.useEffect(
    () => {
      setItems([]);
      setParameters((p) => ({ ...p, type }));
    },
    [type, setItems, setParameters],
  );

  React.useEffect(
    () => {
      setItems([]);
      setParameters((p) => ({ ...p, ...sorting }));
    },
    [setItems, sorting, setParameters],
  );

  React.useEffect(
    () => {
      setItems([]);
      setParameters((p) => ({
        ...p,
        page: 0,
        searchQuery,
      }));
    },
    [searchQuery, setItems, setParameters],
  );

  React.useEffect(
    () => {
      setItems([]);
      setParameters((p) => ({
        ...p,
        page: 0,
        owner: filters.owner?.ownerId,
        stage: filters.stage ?? undefined,
        accountId: filters.agency?.id,
        industryId: filters.industry?.id,
        advertiserId: filters.advertiser?.id,
        createdByUserId: filters.createdBy ? filters.createdBy.id : undefined,
        campaignTypeName: filters.type ? filters.type.name : undefined,
        publicationDateTo: (filters.publicationDate && filters.publicationDate[1])?.format(DATE_ISO),
        publicationDateFrom: (filters.publicationDate && filters.publicationDate[0])?.format(DATE_ISO),
      }));
    },
    [filters, setItems, setParameters],
  );

  React.useEffect(
    () => {
      if ([FILTER_TYPES.END_DATE, FILTER_TYPES.START_DATE].includes(selectedFilter as FILTER_TYPES)) {
        changeFilter(FILTER_TYPES.END_DATE, null);
        changeFilter(FILTER_TYPES.START_DATE, null);
        selectFilter(null);
      }
    },
    [changeFilter, selectFilter, selectedFilter],
  );

  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  );
};

export default context;
