import React from 'react';
import { Loader } from '@adnz/ui';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';

import { CrawlerConfigPage } from 'src/scenes/SelfBookingTool/scenes/CrawlerConfig/CrawlerConfigPage/CrawlerConfigPage';

const SubMenu = React.lazy(() => import('src/scenes/SelfBookingTool/components/SubMenu'));
const NotFoundScene = React.lazy(() => import('src/scenes/NotFound'));
const CrawlerConfigsListPage = React.lazy(
  () => import('src/scenes/SelfBookingTool/scenes/CrawlerConfig/CrawlerConfigsListPage'),
);

const CrawlerConfigsRoutes: React.FC = () => (
  <React.Suspense fallback={<Loader />}>
    <PrivateSwitch>
      <PrivateRoute
        key="sb_crawler_configs_screen"
        roles={[Roles.ADMIN]}
        path="/buy-side/crawler-configs"
        exact
        render={() => (
          <>
            <SubMenu />
            <CrawlerConfigsListPage />
          </>
        )}
      />
      <PrivateRoute
        key="sb_edit_crawler_config"
        roles={[Roles.ADMIN]}
        path="/buy-side/crawler-configs/:crawlerConfigId(\d+)/edit"
        render={({ match }) => {
          if (match.params.crawlerConfigId) {
            return <CrawlerConfigPage crawlerConfigId={match.params.crawlerConfigId} />;
          }
          return null;
        }}
      />
      <PrivateRoute
        key="sb_create_crawler_config"
        roles={[Roles.ADMIN]}
        path="/buy-side/crawler-configs/create/"
        render={() => (
          <CrawlerConfigPage crawlerConfigId={null} />
        )}
      />
      <PrivateRoute
        path="/buy-side/crawler-configs"
        roles={Roles.AGENCY}
        component={NotFoundScene}
      />
    </PrivateSwitch>
  </React.Suspense>
);

export default CrawlerConfigsRoutes;
