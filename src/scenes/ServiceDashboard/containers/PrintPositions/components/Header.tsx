import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageFiltersGroup, PageHeader } from '@adnz/ui';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import SearchFilter from 'src/scenes/ServiceDashboard/containers/SearchFilter';
import NewOfferButton from 'src/scenes/Campaigns/components/NewOfferButton';

export interface IHeader {
  renderFilter: () => React.ReactNode
}

const Header: React.FC<IHeader> = ({
  renderFilter,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <PageHeader title={t('serviceDashboard:PRINT_POSITIONS')} actions={<NewOfferButton />}>
      <PageFiltersGroup css="max-width: 100%; margin-bottom: -5px;">
        <PageHeader.Search><SearchFilter type="print-positions" /></PageHeader.Search>
        {renderFilter && (
          <PrivateRoute
            roles={Roles.BOOK_CAMPAIGNS}
            render={renderFilter}
          />
        )}
      </PageFiltersGroup>
    </PageHeader>
  );
};

export default Header;
