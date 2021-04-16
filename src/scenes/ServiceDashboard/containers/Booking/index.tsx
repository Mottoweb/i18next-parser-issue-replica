import React, { useState, useCallback } from 'react';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import {
  Button, Input, PageHeader, Select,
} from '@adnz/ui';

import { isOption } from 'src/typeGuards';
import { Option } from 'src/types';
import Scheduler from 'src/modules/Scheduler';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import { CampaignPositionType } from '@adnz/api-ws-salesforce';
import EventLayout from './containers/EventLayout';

const typeOptions: Option<CampaignPositionType>[] = [
  { label: 'PRINT_PRODUCTS', value: CampaignPositionType.PRINT },
  { label: 'DIGITAL_PRODUCTS', value: CampaignPositionType.DIGITAL },
];

const Booking: React.FC = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [rawFilterValue, setRawFilterValue] = useState<string>('');
  const [filter] = useDebounce<string>(rawFilterValue, 500);
  const setFilterValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setRawFilterValue(e.target.value), [setRawFilterValue],
  );

  const [rawSelectedType, setRawSelectedType] = useState<Option<CampaignPositionType>>(() => {
    const option = typeOptions[1];
    if (!option) {
      throw new Error('option list it empty');
    }
    return option;
  });
  const handleTypeSelect = useCallback((option: unknown) => {
    if (isOption<CampaignPositionType>(option)) {
      setRawSelectedType(option);
    }
  }, [setRawSelectedType]);
  const formatOptionLabel = useCallback((option: Option<unknown>) => t(option.label), [t]);

  return (
    <>
      <PageHeader
        title={t('serviceDashboard:BOOKING_TITLE')}
        actions={(
          <Button
            id="create-new-offer-button"
            onClick={() => dispatch(push('/buy-side/campaigns/OFFERED/new-order/'))}
          >
            {t('serviceDashboard:NEW_OFFER')}
          </Button>
        )}
      >
        <PrivateRoute
          roles={Roles.MANAGE_PRINT_PRODUCTS}
          render={() => (
            <PageHeader.Select dataTestId="digital-and-booked-dropdown">
              <Select
                isSearchable={false}
                value={rawSelectedType}
                onChange={handleTypeSelect}
                options={typeOptions}
                formatOptionLabel={formatOptionLabel}
              />
            </PageHeader.Select>
          )}
        />
        <PageHeader.Search dataTestId="select-ad-media-container">
          <Input value={rawFilterValue} onChange={setFilterValue} placeholder={t('serviceDashboard:FILTER_PRODUCTS')} />
        </PageHeader.Search>
      </PageHeader>
      {React.useMemo(() => (
        <Scheduler
          filter={filter}
          campaignPositionType={rawSelectedType.value}
          renderEventLayout={(props) => <EventLayout {...props} campaignPositionType={rawSelectedType.value} />}
        />
      ), [rawSelectedType, filter])}
    </>
  );
};

export default Booking;
