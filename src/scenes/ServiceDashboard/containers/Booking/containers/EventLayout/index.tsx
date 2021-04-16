import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Link } from 'react-router-dom';
import { Tooltip } from '@adnz/ui';
import { SWISS_NUMBER_FORMAT } from 'src/constants';
import { Event } from 'src/modules/Scheduler/types';
import Colors from 'src/theme/Colors';
import { CampaignStage, CampaignPositionType } from '@adnz/api-ws-salesforce';

export interface ILayout {
  event: Event
  eventWidth: number,
  campaignPositionType: CampaignPositionType,
}

const Layout: React.FC<ILayout> = ({
  event,
  eventWidth,
  campaignPositionType,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  const color = React.useMemo<string>(() => {
    if (event.stage === CampaignStage.BOOKED) {
      return Colors['adnz-green'];
    }
    if (event.stage === CampaignStage.OFFER_DENIED) {
      return Colors['adnz-danger'];
    }
    return Colors['adnz-blue'];
  }, [event.stage]);

  return (
    <Tooltip
      delayShow={200}
      delayHide={1000}
      placement="top"
      type="popper"
      tooltip={(
        <div className="scheduler__event-popover">
          <BrowserRouter>
            <Link target="_blank" to={`/buy-side/campaigns/ALL/${event.campaignId}`}>
              {event.internalOrderNumber}
              :&nbsp;
              {event.campaignName}
            </Link>
            <p>{event.advertiserName}</p>
            <p>
              {event.billingType ? t(event.billingType) : undefined}
              {!!event.shareOfVoice && (
                <span>
                  {` / SOV: ${event.shareOfVoice}%`}
                </span>
              )}
            </p>
            {(campaignPositionType === CampaignPositionType.DIGITAL) && (
            <>
              {!event.forecastAvailable && !event.forecastCapacity && (
              <p>Forecast: - </p>
              )}
              {!!event.forecastAvailable && !!event.forecastCapacity && (
              <p>
                {`Forecast: ${SWISS_NUMBER_FORMAT.format(event.forecastAvailable)} /
                ${SWISS_NUMBER_FORMAT.format(event.forecastCapacity)} (${event.forecastShareOfVoice}%) `}
              </p>
              )}
            </>
            )}
          </BrowserRouter>
        </div>
      )}
    >
      <div
        key={event.id}
        data-cellpositionid={event.cellPositionId}
        className="scheduler__event"
        style={{
          minWidth: eventWidth - 2,
          maxWidth: eventWidth - 2,
          background: color,
          gridRow: event.cellPositionId + 1,
        }}
      >
        {event.stage === CampaignStage.OFFERED ? t('serviceDashboard:OFFERED') : t('serviceDashboard:BOOKED')}
        {' '}
        -
        {event.advertiserName}
      </div>
    </Tooltip>
  );
};

export default Layout;
