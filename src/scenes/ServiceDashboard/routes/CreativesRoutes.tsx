import React from 'react';
import { Loader } from '@adnz/ui';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';

import CreativeAccountFilter, {
  CreativeAccountFilterProvider,
} from 'src/scenes/SelfBookingTool/components/CreativeAccountFilter';

const SubMenu = React.lazy(() => import('src/scenes/SelfBookingTool/components/SubMenu'));
const CreativePage = React.lazy(() => import('src/scenes/SelfBookingTool/scenes/CreativePage'));
const CreativesPage = React.lazy(() => import('src/scenes/SelfBookingTool/scenes/CreativesPage'));
const NotFoundScene = React.lazy(() => import('src/scenes/NotFound'));
const AdserverCreativesPage = React.lazy(() => import('src/scenes/SelfBookingTool/scenes/AdserverCreativesPage'));
const AdServerCreativeDetails = React.lazy(() => import('src/scenes/SelfBookingTool/scenes/AdServerCreativeDetails'));

const CreativesRoutes: React.FC = () => (
  <React.Suspense fallback={<Loader />}>
    <PrivateSwitch>
      <PrivateRoute
        key="sb_creatives_screen"
        roles={[Roles.ADMIN, Roles.SELF_BOOKING, Roles.ADSERVER_CREATIVES]}
        path="/buy-side/creatives"
        exact
        render={() => (
          <CreativeAccountFilterProvider>
            <>
              <SubMenu filter={CreativeAccountFilter} />
              <CreativesPage />
            </>
          </CreativeAccountFilterProvider>
        )}
      />
      <PrivateRoute
        key="sb_create_creative"
        roles={[Roles.ADMIN, Roles.SELF_BOOKING]}
        path="/buy-side/creatives/create"
        render={() => (
          <CreativePage />
        )}
      />
      <PrivateRoute
        key="sb_edit_creative"
        roles={[Roles.ADMIN, Roles.SELF_BOOKING]}
        exact
        path="/buy-side/creatives/:creativeId/edit"
        render={() => (
          <CreativePage />
        )}
      />
      <PrivateRoute
        key="sb_creatives_screen_adserver"
        roles={[Roles.ADMIN, Roles.ADSERVER_CREATIVES]}
        path="/buy-side/creatives/adserver-creatives/:creativeId"
        render={() => (
          <CreativeAccountFilterProvider>
            <>
              <SubMenu />
              <AdServerCreativeDetails />
            </>
          </CreativeAccountFilterProvider>
        )}
      />
      <PrivateRoute
        key="sb_creatives_screen_adserver"
        roles={[Roles.ADMIN, Roles.ADSERVER_CREATIVES]}
        path="/buy-side/creatives/adserver-creatives"
        render={() => (
          <CreativeAccountFilterProvider>
            <>
              <SubMenu />
              <AdserverCreativesPage />
            </>
          </CreativeAccountFilterProvider>
        )}
      />
      <PrivateRoute
        path="/buy-side/creatives"
        roles={Roles.AGENCY}
        component={NotFoundScene}
      />
    </PrivateSwitch>
  </React.Suspense>
);

export default CreativesRoutes;
