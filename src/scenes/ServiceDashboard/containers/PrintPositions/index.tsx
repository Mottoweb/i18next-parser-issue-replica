import React from 'react';

import StatusFilter, { StatusFilterEntity } from 'src/scenes/ServiceDashboard/containers/StatusFilter';

import Table from './components/Table';
import Header from './components/Header';
import { PrintPositionsContextProvider } from './Context';

export interface IPrintPositions {
  type: string
  renderFilter: () => React.ReactNode
}

const PrintPositions: React.FC<IPrintPositions> = ({
  type,
  renderFilter,
}) => (
  <PrintPositionsContextProvider type={type}>
    <StatusFilter entity={StatusFilterEntity.PRINT} />
    <Header renderFilter={renderFilter} />
    <Table />
  </PrintPositionsContextProvider>
);

export default PrintPositions;
