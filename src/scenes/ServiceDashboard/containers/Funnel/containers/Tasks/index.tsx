import React, { lazy, Suspense } from 'react';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';
import {
  Button, Loader, PageHeader, SubHeader,
} from '@adnz/ui';
import { Container } from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as actions from './actions';
import FormModal from './containers/Modal';
import './splitscreen.scss';

const Leads = lazy(() => import('./containers/Leads'));
const AllTasks = lazy(() => import('./containers/AllTasks'));
const Snoozed = lazy(() => import('./containers/Snoozed'));
const InProgress = lazy(() => import('./containers/InProgress'));
const Done = lazy(() => import('./containers/Done'));
const Archived = lazy(() => import('./containers/Archived'));
const NotFoundScene = lazy(() => import('src/scenes/NotFound'));

export interface ITaskList {
  filtersGroup: React.ReactNode
}

const TaskList: React.FC<ITaskList> = ({
  filtersGroup,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const create = React.useCallback(
    () => dispatch(actions.openModal(undefined)),
    [dispatch],
  );
  return (
    <>
      <FormModal />
      <PrivateSwitch>
        <PrivateRoute
          exact
          roles={Roles.WORKFLOW}
          path="/workflows/salesFunnel/tasks/:path(all|inprogress|snoozed|done|archived)"
          render={() => (
            <SubHeader fluid>
              <SubHeader.Nav>
                <SubHeader.NavItem exact to="/workflows/salesFunnel/tasks/all" dataTestId="all-tasks">
                  {t('serviceDashboard:ALL_TASKS')}
                </SubHeader.NavItem>
                <SubHeader.NavItem to="/workflows/salesFunnel/tasks/inprogress" dataTestId="in-progress-tasks">
                  {t('serviceDashboard:IN_PROGRESS')}
                </SubHeader.NavItem>
                <SubHeader.NavItem to="/workflows/salesFunnel/tasks/snoozed" dataTestId="snoozed-tasks">
                  {t('serviceDashboard:SNOOZED')}
                </SubHeader.NavItem>
                <SubHeader.NavItem to="/workflows/salesFunnel/tasks/done" dataTestId="done-tasks">
                  {t('serviceDashboard:DONE')}
                </SubHeader.NavItem>
                <SubHeader.NavItem to="/workflows/salesFunnel/tasks/archived" dataTestId="archived-tasks">
                  {t('serviceDashboard:ARCHIVED')}
                </SubHeader.NavItem>
              </SubHeader.Nav>
            </SubHeader>
          )}
        />
      </PrivateSwitch>
      <PageHeader
        title={(
          <PrivateSwitch>
            <PrivateRoute
              exact
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/all"
              render={() => <span>{t('serviceDashboard:ALL_TASKS_TITLE')}</span>}
            />
            <PrivateRoute
              exact
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/leads"
              render={() => <span>{t('serviceDashboard:LEADS')}</span>}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/inprogress"
              render={() => <span>{t('serviceDashboard:IN_PROGRESS_TASKS')}</span>}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/snoozed"
              render={() => <span>{t('serviceDashboard:SNOOZED_TASKS')}</span>}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/done"
              render={() => <span>{t('serviceDashboard:DONE_TASKS')}</span>}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/archived"
              render={() => <span>{t('serviceDashboard:ARCHIVED_TASKS')}</span>}
            />
          </PrivateSwitch>
        )}
        actions={(<Button onClick={create} id="create-lead-button">{t('serviceDashboard:CREATE_LEAD')}</Button>)}
        children={filtersGroup}
        fluid
      />
      <Container fluid>
        <Suspense fallback={<Loader />}>
          <PrivateSwitch>
            <PrivateRoute
              exact
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/all"
              render={() => <AllTasks />}
            />
            <PrivateRoute
              exact
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/leads"
              render={() => <Leads status="NEW" />}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/inprogress"
              render={() => <InProgress status="IN_PROGRESS" />}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/snoozed"
              render={() => <Snoozed status="SNOOZED" />}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/done"
              render={() => <Done status="DONE" />}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              path="/workflows/salesFunnel/tasks/archived"
              render={() => <Archived status="ARCHIVED" />}
            />
            <PrivateRoute
              roles={Roles.WORKFLOW}
              component={NotFoundScene}
            />
          </PrivateSwitch>
        </Suspense>
      </Container>
    </>
  );
};

export default TaskList;
