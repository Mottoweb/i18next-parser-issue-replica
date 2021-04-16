import React from 'react';
import { Redirect } from 'react-router-dom';

import { Loader } from '@adnz/ui';
import { CampaignPositionType } from '@adnz/api-ws-salesforce';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';
import { FILTER_TYPES } from 'src/modules/CampaignFilters/context';

const CampaignFilters = React.lazy(() => import('src/modules/CampaignFilters'));

const Flights = React.lazy(() => import('../containers/Flights'));
const PrintPositions = React.lazy(() => import('../containers/PrintPositions'));

const FlightsRoutes: React.FC = () => (
  <React.Suspense fallback={<Loader />}>
    <PrivateSwitch>
      {/* Legacy redirection */}
      <PrivateRoute
        roles={Roles.AGENCY}
        path="/buy-side/flights"
        render={() => (
          <Redirect to="/buy-side/digital-positions/RUNNING" />
        )}
      />

      {/* Digital positions */}
      <PrivateRoute
        exact
        roles={Roles.AGENCY}
        path="/buy-side/digital-positions"
        render={() => (
          <Redirect to="/buy-side/digital-positions/RUNNING" />
        )}
      />
      <PrivateRoute
        roles={Roles.AGENCY}
        path="/buy-side/digital-positions/:type?"
        render={({ match }) => (
          <Flights
            type={match.params.type || 'ALL'}
            renderFilter={() => (
              <CampaignFilters
                allowedOptions={[
                  FILTER_TYPES.ACCOUNT,
                  FILTER_TYPES.SALES,
                  FILTER_TYPES.ADVERTISER,
                  FILTER_TYPES.STAGE,
                  FILTER_TYPES.CAMPAIGN_TYPE,
                  FILTER_TYPES.INDUSTRY,
                  FILTER_TYPES.CREATED_BY,
                  FILTER_TYPES.END_DATE,
                  FILTER_TYPES.START_DATE,
                ]}
              />
            )}
            campaignPositionType={CampaignPositionType.DIGITAL}
          />
        )}
      />

      {/* Print positions */}
      <PrivateRoute
        exact
        roles={Roles.AGENCY}
        path="/buy-side/print-positions"
        render={() => (
          <Redirect to="/buy-side/print-positions/BOOKED" />
        )}
      />
      <PrivateRoute
        roles={Roles.AGENCY}
        path="/buy-side/print-positions/:type?"
        render={({ match }) => (
          <PrintPositions
            type={match.params.type || 'ALL'}
            renderFilter={() => (
              <CampaignFilters
                allowedOptions={[
                  FILTER_TYPES.ACCOUNT,
                  FILTER_TYPES.SALES,
                  FILTER_TYPES.ADVERTISER,
                  FILTER_TYPES.STAGE,
                  FILTER_TYPES.CAMPAIGN_TYPE,
                  FILTER_TYPES.INDUSTRY,
                  FILTER_TYPES.CREATED_BY,
                  FILTER_TYPES.PUBLICATION_DATE,
                ]}
              />
            )}
          />
        )}
      />
    </PrivateSwitch>
  </React.Suspense>
);

export default FlightsRoutes;
