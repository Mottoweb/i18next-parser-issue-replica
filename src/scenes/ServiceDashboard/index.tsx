import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader } from '@adnz/ui';
import { PrivateSwitch, PrivateRoute, Roles } from '@adnz/use-auth';
import { FormPresaveProvider } from 'src/components/form/FormPresave';
import FunnelRoutes from 'src/scenes/ServiceDashboard/routes/FunnelRoutes';
import FlightsRoutes from 'src/scenes/ServiceDashboard/routes/FlightsRoutes';
import AccountsRoutes from 'src/scenes/ServiceDashboard/routes/AccountsRoutes';
import ContactsRoutes from 'src/scenes/ServiceDashboard/routes/ContactsRoutes';
import DashboardRoutes from 'src/scenes/ServiceDashboard/routes/DashboardRoutes';
import CampaignsRoutes from 'src/scenes/ServiceDashboard/routes/CampaignsRoutes';
import CreativesRoutes from 'src/scenes/ServiceDashboard/routes/CreativesRoutes';
import CrawlerConfigsRoutes from 'src/scenes/ServiceDashboard/routes/CrawlerConfigsRoutes';
import { CampaignFiltersProvider } from 'src/modules/CampaignFilters/context';

const Deals = React.lazy(() => import('./containers/Deals'));

const ServiceDashboard: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <div className="dashboard-cover">
      <Helmet title={`${t('serviceDashboard:SERVICE_DASHBOARD')} - ${t('serviceDashboard:BASE_TITLE')}`} />
      <FormPresaveProvider>
        <React.Suspense fallback={<Loader />}>
          <CampaignFiltersProvider>
            <FunnelRoutes />
            <AccountsRoutes />
            <CampaignsRoutes />
            <FlightsRoutes />
          </CampaignFiltersProvider>
          <ContactsRoutes />
          <DashboardRoutes />
          <CreativesRoutes />
          <CrawlerConfigsRoutes />
          <PrivateSwitch>
            <PrivateRoute
              roles={Roles.ADMIN}
              path="/buy-side/deals/"
              render={() => <Deals />}
            />
            <PrivateRoute
              roles={Roles.AGENCY}
              path="/agency"
              render={() => (
                <Redirect to="/buy-side" />
              )}
            />
          </PrivateSwitch>
        </React.Suspense>
      </FormPresaveProvider>
    </div>
  );
};

export default ServiceDashboard;
