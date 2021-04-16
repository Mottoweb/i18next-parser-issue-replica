import React from 'react';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';

import SalesFunnel from '../containers/Funnel';

const FunnelRoutes: React.FC = () => (
  <PrivateSwitch>
    <PrivateRoute
      roles={[Roles.BOOK_CAMPAIGNS, Roles.SALESFUNNEL]}
      path="/workflows/salesFunnel"
      component={SalesFunnel}
    />
  </PrivateSwitch>
);

export default FunnelRoutes;
