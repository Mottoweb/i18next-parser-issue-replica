import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@adnz/ui';
import { PrivateRoute, PrivateSwitch, Roles } from '@adnz/use-auth';
import { ContactsProvider } from 'src/scenes/Contacts/context';
import UpperMenu from '../UpperMenu';
import SearchFilter from '../containers/SearchFilter';

const Contacts = React.lazy(() => import('src/scenes/Contacts'));
const NotFoundScene = React.lazy(() => import('src/scenes/NotFound'));
const ContactMainForm = React.lazy(() => import('src/scenes/Contacts/ContactForm'));

const ContactsRoutes: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <React.Suspense fallback={<Loader />}>
      <PrivateSwitch>
        <PrivateRoute
          roles={[Roles.ADMIN, Roles.MANAGE_ACCOUNTS, Roles.SELF_BOOKING]}
          path="/buy-side/contacts/create"
          render={() => (
            <>
              <UpperMenu />
              <ContactMainForm />
            </>
          )}
        />
        <PrivateRoute
          roles={[Roles.ADMIN, Roles.MANAGE_ACCOUNTS, Roles.SELF_BOOKING]}
          path="/buy-side/contacts/"
          render={() => (
            <ContactsProvider>
              <Contacts
                searchFilter={() => (
                  <SearchFilter
                    id="search-contact-input"
                    type="contacts"
                    placeholder={t('serviceDashboard:SEARCH_FOR_CONTACTS')}
                    noRedirect
                  />
                )}
              />
            </ContactsProvider>
          )}
        />
        <PrivateRoute
          path="/buy-side/contacts"
          roles={Roles.AGENCY}
          component={NotFoundScene}
        />
      </PrivateSwitch>
    </React.Suspense>
  );
};

export default ContactsRoutes;
