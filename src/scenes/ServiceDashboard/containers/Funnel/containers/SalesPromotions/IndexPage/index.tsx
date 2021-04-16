import React, { lazy } from 'react';
import {
  Switch, Route, Redirect, useRouteMatch,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NavRow, { NavRowItem } from 'src/components/NavRow';
import PromotionDetails from '../Promotions/PromotionDetails';

const PromotionList = lazy(() => import('../Promotions/PromotionsTable'));
const TypeConfigs = lazy(() => import('../TypeConfigs'));
const NotFoundScene = lazy(() => import('src/scenes/NotFound'));

const Index: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <>
      <NavRow>
        <>
          <NavRowItem
            active={!!useRouteMatch({
              path: '/workflows/salesFunnel/promotions/list',
              exact: true,
            })}
            to="/workflows/salesFunnel/promotions/list"
            title={t('serviceDashboard:SALES_PROMOTIONS')}
          />
          <NavRowItem
            active={!!useRouteMatch({
              path: '/workflows/salesFunnel/promotions/type-configs',
              exact: true,
            })}
            to="/workflows/salesFunnel/promotions/type-configs"
            title={t('serviceDashboard:TYPE_CONFIG')}
          />
        </>
      </NavRow>
      <Switch>
        <Route
          exact
          path="/workflows/salesFunnel/promotions"
          render={() => (
            <Redirect to="/workflows/salesFunnel/promotions/list" />
          )}
        />
        <Route
          path="/workflows/salesFunnel/promotions/details/:promotionId"
          render={({ match }) => (
            <PromotionDetails
              promotionId={match.params.promotionId}
            />
          )}
        />
        <Route
          path="/workflows/salesFunnel/promotions/list"
          exact
          component={PromotionList}
        />
        <Route
          path="/workflows/salesFunnel/promotions/type-configs"
          exact
          component={TypeConfigs}
        />
        <Route component={NotFoundScene} />
      </Switch>
    </>
  );
};

export default Index;
