import React from 'react';
import { Loader } from '@adnz/ui';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';

const NotFoundScene = React.lazy(() => import('src/scenes/NotFound'));

const Documents = React.lazy(() => import('../containers/Documents'));
const Dashboard = React.lazy(() => import('../containers/Dashboard'));

const DashboardRoutes: React.FC = () => (
  <React.Suspense fallback={<Loader />}>
    <PrivateSwitch>
      <PrivateRoute
        exact
        roles={Roles.AGENCY}
        path="/buy-side/dashboard"
        component={Dashboard}
      />
      <PrivateRoute
        roles={Roles.AGENCY}
        path="/buy-side/dashboard/documents"
        component={Documents}
      />
      <PrivateRoute
        path="/buy-side/dashboard"
        roles={Roles.AGENCY}
        component={NotFoundScene}
      />
    </PrivateSwitch>
  </React.Suspense>
);

export default DashboardRoutes;
