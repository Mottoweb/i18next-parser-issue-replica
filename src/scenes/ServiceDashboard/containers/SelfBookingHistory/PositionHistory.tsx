import React from 'react';
import { useRequest } from '@adnz/use-request';
import {
  EntityType, PaginatedActivity, getActivities, getActivitiesParameters,
} from '@adnz/api-ws-activity';

import Table from './Table';

export interface IPositionHistory {
  campaignId: string
}

const PositionHistory: React.FC<IPositionHistory> = ({
  campaignId,
}) => {
  const [order, setOrder] = React.useState<'ASC' | 'DESC'>('DESC');

  const parameters = React.useMemo<[getActivitiesParameters]>(() => [{
    entityId: campaignId,
    entityType: EntityType.CAMPAIGN_POSITION_UPDATE,
    sort: 'creationDate',
    order,
  }], [campaignId, order]);

  const [{ items }, { pending }] = useRequest({
    apiMethod: getActivities,
    parameters,
    defaultData: { items: [], total: 0 } as PaginatedActivity,
  });

  const handleChangeOrder = React.useCallback(() => setOrder(order === 'ASC' ? 'DESC' : 'ASC'), [order]);

  return (
    <Table
      data={items}
      order={order}
      loading={pending}
      handleChangeOrder={handleChangeOrder}
    />
  );
};

export default PositionHistory;
