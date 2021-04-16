import React, { lazy, Suspense } from 'react';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';
import { Loader } from '@adnz/ui';
import { getSalesPersons } from '@adnz/api-ws-funnel';
import { TasksFilterProvider } from './containers/RocketFilter/context';
import SettingsMenu from './components/SettingsMenu';
import { SelectOptionsCacheContextProvider } from './containers/SalesSelect/SelectOptionsCacheContext';
import { SalesSelectContextProvider } from './containers/SalesSelect/Context';

const FunnelMenu = lazy(() => import('./components/FunnelMenu'));
const Tasks = lazy(() => import('./containers/Tasks'));
const Activities = lazy(() => import('./containers/Activities'));
const Meetings = lazy(() => import('./containers/Meetings'));
const SourcesList = lazy(() => import('./containers/SourcesList'));
const TopicsList = lazy(() => import('./containers/MeetingTopicList'));
const TaskTopicsList = lazy(() => import('./containers/TaskTopicList'));
const TagsList = lazy(() => import('./containers/TagsList'));
const TaskDetails = lazy(() => import('./containers/Tasks/containers/TaskDetails'));
const NotFoundScene = lazy(() => import('src/scenes/NotFound'));
const Booking = lazy(() => import('../Booking'));
const SalesPromotions = lazy(() => import('./containers/SalesPromotions'));

const SalesFunnel = () => (
  <TasksFilterProvider>
    <SelectOptionsCacheContextProvider apiMethod={getSalesPersons}>
      <Suspense fallback={<Loader />}>
        <PrivateSwitch>
          <PrivateRoute
            roles={Roles.BOOK_CAMPAIGNS}
            path="/workflows/salesFunnel/booking"
            component={Booking}
          />
          <PrivateRoute
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/:type(all|inprogress|x|done|snoozed|leads)/:taskId(\d+)"
            render={({ match }) => (
              <TaskDetails
                taskId={match.params.taskId.toString()}
                taskType={match.params.type}
              />
            )}
          />
          <PrivateRoute
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/sources"
            render={() => (
              <SourcesList subNav={(<SettingsMenu />)} />
            )}
          />
          <PrivateRoute
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/topics"
            render={() => (
              <TopicsList subNav={(<SettingsMenu />)} />
            )}
          />
          <PrivateRoute
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/promotions"
            component={SalesPromotions}
          />
          <PrivateRoute
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/task-topics"
            render={() => (
              <TaskTopicsList subNav={(<SettingsMenu />)} />
            )}
          />
          <PrivateRoute
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/meetings"
            render={() => (
              <Meetings filtersGroup={(<FunnelMenu />)} />
            )}
          />
          <PrivateRoute
            exact
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/touchpoints"
            render={() => (
              <Activities filtersGroup={(<FunnelMenu />)} />
            )}
          />
          <PrivateRoute
            exact
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/tags"
            render={() => (
              <TagsList subNav={(<SettingsMenu />)} />
            )}
          />
          <PrivateRoute
            roles={[Roles.SALESFUNNEL]}
            path="/workflows/salesFunnel/tasks"
            render={() => (
              <SalesSelectContextProvider>
                <Tasks filtersGroup={(<FunnelMenu />)} />
              </SalesSelectContextProvider>
            )}
          />
          <PrivateRoute
            roles={Roles.WORKFLOW}
            component={NotFoundScene}
          />
        </PrivateSwitch>
      </Suspense>
    </SelectOptionsCacheContextProvider>
  </TasksFilterProvider>
);

export default SalesFunnel;
