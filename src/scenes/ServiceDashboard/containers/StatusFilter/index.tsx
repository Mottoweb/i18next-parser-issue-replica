import React from 'react';
import { useTranslation } from 'react-i18next';

import { SubHeader } from '@adnz/ui';
import { useRequest } from '@adnz/use-request';
import { AgencyLink, getAgencyDashboardLinks } from '@adnz/api-ws-salesforce';

import ErrorComponent from 'src/components/Error';
import LoaderComponent from 'src/components/Loader';

export enum StatusFilterEntity {
  PRINT = 'print-positions',
  DIGITAL = 'digital-positions',
  CAMPAIGNS = 'campaigns',
}

interface IStatusFilter {
  entity: StatusFilterEntity
  filters?: React.ReactNode
}

const StatusFilter: React.FC<IStatusFilter> = ({
  entity,
  filters,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [statuses, setStatuses] = React.useState<AgencyLink[]>([]);

  const [data, { pending, error }] = useRequest({
    apiMethod: getAgencyDashboardLinks,
  });

  React.useEffect(
    () => {
      if (entity === StatusFilterEntity.PRINT) {
        setStatuses(data?.filter((link) => link.name !== 'RUNNING') ?? []);
      } else {
        setStatuses(data ?? []);
      }
    },
    [entity, data],
  );

  if (pending) {
    return <LoaderComponent />;
  }

  if (error) {
    return <ErrorComponent title={error.message} />;
  }

  return (
    <SubHeader fluid>
      <SubHeader.Nav>
        {statuses.map((status) => (
          <SubHeader.NavItem
            key={status.name}
            to={`/buy-side/${entity}/${status.name}`}
            dataTestId={`status-${status.name}-link`}
          >
            {t(status.name)}
          </SubHeader.NavItem>
        ))}
      </SubHeader.Nav>
      {filters && filters}
    </SubHeader>
  );
};

export default React.memo(StatusFilter);
