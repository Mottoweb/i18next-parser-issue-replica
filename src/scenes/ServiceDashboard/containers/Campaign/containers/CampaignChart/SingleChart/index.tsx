import React from 'react';
import { useSelector } from 'react-redux';
import Chart from 'src/components/CampaignChart';
import { SWISS_NUMBER_FORMAT } from 'src/constants';
import { useTooltip } from '@adnz/use-tooltip';
import { useTranslation } from 'react-i18next';
import * as selectors from '../selector';

type ChartInnerProps = {
  campaignId: string,
};

const ChartInner: React.FC<ChartInnerProps> = ({
  campaignId,
  ...props
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [show, hide] = useTooltip();
  const data = useSelector(
    // @ts-expect-error expected 1 argument
    (state) => selectors.getCampaignChartDataCurrent(state, { itemId: campaignId }),
  );
  const startDate = useSelector(
    // @ts-expect-error expected 1 argument
    (state) => selectors.getCampaignStartDate(state, { itemId: campaignId }),
  );
  const endDate = useSelector(
    // @ts-expect-error expected 1 argument
    (state) => selectors.getCampaignEndDate(state, { itemId: campaignId }),
  );
  const useArea = useSelector(
    // @ts-expect-error expected 1 argument
    (state) => selectors.useArea(state, { itemId: campaignId }),
  );
  const onMouseOver = React.useCallback(
    (evt, date, val, type) => show(evt.x + 10, evt.y + 10, (
      <div>
        <div>{t(type)}</div>
        <div>
          <strong>
            {date}
            :
            {' '}
          </strong>
          {SWISS_NUMBER_FORMAT.format(val)}
        </div>
      </div>
    )),
    [show, t],
  );
  const onMouseOut = React.useCallback(
    () => hide(),
    [hide],
  );

  return (
    <Chart
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      data={data}
      startDate={startDate}
      endDate={endDate}
      useArea={useArea}
      {...props}
    />
  );
};

export default React.memo(ChartInner);
