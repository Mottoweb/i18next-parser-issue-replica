import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@adnz/ui';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';
import AccountOwnerRoute from 'src/components/AccountOwnerRoute';

const Accounts = React.lazy(() => import('src/scenes/AccountsWithN4'));
const ContactForm = React.lazy(() => import('src/modules/ContactForm'));
const AccountForm = React.lazy(() => import('src/scenes/AccountsWithN4/containers/AccountForm'));
const NotFoundScene = React.lazy(() => import('src/scenes/NotFound'));
const SBAccountForm = React.lazy(() => import('src/scenes/AccountsWithN4/containers/SBAccountForm'));

const Account = React.lazy(() => import('../containers/Account'));
const History = React.lazy(() => import('../containers/History'));
const UpperMenu = React.lazy(() => import('../UpperMenu'));
const SearchFilter = React.lazy(() => import('../containers/SearchFilter'));

const AccountsRoutes: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <React.Suspense fallback={<Loader />}>
      <PrivateSwitch>
        <PrivateRoute
          roles={[Roles.ADMIN, Roles.MANAGE_ACCOUNTS]}
          path="/buy-side/accounts/edit/:accountId(\d+)/contacts/create"
          render={() => (
            <>
              <UpperMenu />
              <ContactForm />
            </>
          )}
        />
        <PrivateRoute
          roles={[Roles.ADMIN, Roles.MANAGE_ACCOUNTS]}
          path="/buy-side/accounts/edit/:accountId(\d+)/contacts/:contactId(\d+)"
          render={() => (
            <>
              <UpperMenu />
              <ContactForm />
            </>
          )}
        />
        <PrivateRoute
          exact
          roles={[Roles.ADMIN, Roles.MANAGE_ACCOUNTS]}
          path="/buy-side/accounts/create/"
          render={() => (
            <AccountForm renderUpperMenu={() => <UpperMenu />} />
          )}
        />
        <AccountOwnerRoute
          identifier="accountId"
          roles={[Roles.ADMIN, Roles.MANAGE_ACCOUNTS]}
          path="/buy-side/accounts/edit/:accountId"
          render={() => (
            <AccountForm renderUpperMenu={() => <UpperMenu />} />
          )}
        />
        <PrivateRoute
          exact
          path="/buy-side/accounts/create/"
          render={() => (
            <SBAccountForm renderUpperMenu={() => <UpperMenu />} />
          )}
        />
        <AccountOwnerRoute
          identifier="accountId"
          path="/buy-side/accounts/edit/:accountId"
          render={() => (
            <SBAccountForm renderUpperMenu={() => <UpperMenu />} />
          )}
        />
        <PrivateRoute
          roles={[Roles.ADMIN, Roles.BOOK_CAMPAIGNS]}
          path="/buy-side/accounts/:accountId/history"
          render={({ match }) => (
            <History
              accountId={match.params.accountId}
              renderUpperMenu={() => <UpperMenu />}
            />
          )}
        />
        <PrivateRoute
          roles={[Roles.ADMIN, Roles.MANAGE_ACCOUNTS]}
          path="/buy-side/accounts/:accountId"
          render={({ match }) => {
            if (match.params.accountId) {
              return (
                <Account accountId={match.params.accountId} />
              );
            }
            return null;
          }}
        />
        <PrivateRoute
          path="/buy-side/accounts/"
          render={() => (
            <Accounts searchFilter={() => (
              <SearchFilter
                id="search-account-input"
                type="accounts"
                placeholder={t('serviceDashboard:SEARCH_FOR_ACCOUNTS')}
                noRedirect
              />
            )}
            />
          )}
        />
        <PrivateRoute
          path="/buy-side/accounts"
          roles={Roles.AGENCY}
          component={NotFoundScene}
        />
      </PrivateSwitch>
    </React.Suspense>
  );
};

export default AccountsRoutes;
