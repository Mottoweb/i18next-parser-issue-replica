import React from 'react';
import { PrivateRoute, Roles } from '@adnz/use-auth';

import AccountFilterSelect from 'src/modules/CampaignFilters/AgencySelect';

import UserSelect from '../containers/UserSelect';
import SalesSelect from '../containers/SalesSelect';
import LabelSelect from '../containers/LabelSelect';
import TopicSelect from '../containers/TopicSelect';
import RocketFilter from '../containers/RocketFilter';
import SourceSelect from '../containers/SourcesSelect';
import OutcomeSelect from '../containers/OutcomeSelect';
import TimeframeSelect from '../containers/TimeframeSelect';
import CommentCreatorSelect from '../containers/CommentCreatorSelect';
import ContactSelect from '../containers/ContactSelect';

const FunnelMenu: React.FC = () => (
  <PrivateRoute
    roles={[Roles.SALESFUNNEL]}
    path="/workflows/salesFunnel/(tasks|touchpoints|meetings)"
    render={() => (
      <>
        <PrivateRoute
          roles={[Roles.SALESFUNNEL]}
          path="/workflows/salesFunnel/tasks/leads"
          exact
          render={() => (
            <>
              <LabelSelect />
              <SourceSelect />
              <SalesSelect />
              <AccountFilterSelect />
              <RocketFilter />
            </>
          )}
        />
        <PrivateRoute
          roles={[Roles.SALESFUNNEL]}
          path="/workflows/salesFunnel/meetings"
          render={() => (
            <>
              <TopicSelect />
              <TimeframeSelect defaultTitle="CREATED_TIMEFRAME" />
              <AccountFilterSelect />
              <CommentCreatorSelect />
            </>
          )}
        />
        <PrivateRoute
          roles={[Roles.SALESFUNNEL]}
          path="/workflows/salesFunnel/tasks/(all|inprogress|snoozed|archived)"
          render={() => (
            <>
              <TopicSelect />
              <LabelSelect />
              <SourceSelect />
              <UserSelect />
              <AccountFilterSelect onlyOwnedAccounts />
              <RocketFilter />
            </>
          )}
        />
        <PrivateRoute
          roles={[Roles.SALESFUNNEL]}
          path="/workflows/salesFunnel/touchpoints"
          render={() => (
            <>
              <AccountFilterSelect />
              <CommentCreatorSelect />
              <ContactSelect />
            </>
          )}
        />
        <PrivateRoute
          roles={[Roles.SALESFUNNEL]}
          path="/workflows/salesFunnel/tasks/done"
          render={() => (
            <>
              <TopicSelect />
              <OutcomeSelect />
              <TimeframeSelect />
              <LabelSelect />
              <SourceSelect />
              <UserSelect />
              <AccountFilterSelect />
              <RocketFilter />
            </>
          )}
        />
      </>
    )}
  />
);

export default React.memo(FunnelMenu);
