import React from 'react';
import { Tooltip, Icons, SubHeader } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import {
  SWISS_NUMBER_FORMAT,
} from 'src/constants';
import { useSelector } from 'react-redux';
import * as selectors from 'src/scenes/ServiceDashboard/containers/Dashboard/containers/Statistics/selectors';
import {
  Statistics, StatisticsItem, StatisticsTitle, StatisticsValue,
} from './styles';

const StatisticsContainer = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const data = useSelector(selectors.data);
  return (
    <SubHeader>
      <Statistics>
        <Tooltip
          placement="bottom"
          tooltip={t('serviceDashboard:OFFERED_CAMPAIGNS')}
          containerComponent={StatisticsItem}
        >
          <Icons.ListAlt />
          <StatisticsTitle>{t('serviceDashboard:OFFERED')}</StatisticsTitle>
          <StatisticsValue>{SWISS_NUMBER_FORMAT.format(data.get('offeredCampaigns'))}</StatisticsValue>
        </Tooltip>

        <Tooltip
          placement="bottom"
          tooltip={t('serviceDashboard:BOOKED_CAMPAIGNS')}
          containerComponent={StatisticsItem}
        >
          <Icons.Booked />
          <StatisticsTitle>{t('serviceDashboard:BOOKED')}</StatisticsTitle>
          <div>
            <StatisticsValue>{SWISS_NUMBER_FORMAT.format(data.get('bookedCampaigns'))}</StatisticsValue>
          </div>
        </Tooltip>
        <Tooltip
          placement="bottom"
          tooltip={t('serviceDashboard:RUNNING_CAMPAIGNS')}
          containerComponent={StatisticsItem}
        >
          <Icons.Loading size={25} />
          <StatisticsTitle>{t('serviceDashboard:RUNNING')}</StatisticsTitle>
          <StatisticsValue>{SWISS_NUMBER_FORMAT.format(data.get('runningCampaigns'))}</StatisticsValue>
        </Tooltip>
        <Tooltip
          placement="bottom"
          tooltip={t('serviceDashboard:ALL_CAMPAIGNS')}
          containerComponent={StatisticsItem}
        >
          <Icons.Alliance />
          <StatisticsTitle>{t('serviceDashboard:TOTAL_CAMPAIGNS')}</StatisticsTitle>
          <StatisticsValue>{SWISS_NUMBER_FORMAT.format(data.get('totalCampaigns'))}</StatisticsValue>
        </Tooltip>
        <Tooltip
          placement="bottom"
          tooltip={t('serviceDashboard:PIXEL_POINTS')}
          containerComponent={StatisticsItem}
        >
          <Icons.CoinsAlt />
          <StatisticsTitle>{t('serviceDashboard:PIXEL_POINTS')}</StatisticsTitle>
          <StatisticsValue>{SWISS_NUMBER_FORMAT.format(data.get('pixelPoints'))}</StatisticsValue>
        </Tooltip>
      </Statistics>
    </SubHeader>
  );
};

export default StatisticsContainer;
