import React from 'react';
import { useSelector } from 'react-redux';
import EmptyChart, { EmptyChartContainer } from 'src/components/charts/EmptyChart';
import * as selectors from '../selector';
import AreaChart from './AreaChart';

interface ImpressionClicksChartConnectProps {
  campaignId: string,
  xTicks?: number,
  aspectRatio?: number,
}

const ImpressionClicksChartConnect: React.FC<ImpressionClicksChartConnectProps> = React.memo(({
  campaignId,
  xTicks = 5,
  aspectRatio = 4,
}) => {
  const dataset = useSelector(
    // @ts-expect-error expected 1 argument
    (state) => selectors.getImpressionClicksDataset(state, { itemId: campaignId }),
  );
  const startDate = useSelector(
    // @ts-expect-error expected 1 argument
    (state) => selectors.getCampaignStartDate(state, { itemId: campaignId }),
  );
  const endDate = useSelector(
    // @ts-expect-error expected 1 argument
    (state) => selectors.getCampaignEndDate(state, { itemId: campaignId }),
  );

  const dataset2 = dataset
    ? dataset.toJS()
    : { clicks: [], impressions: [] };
  const isEmpty = dataset2.impressions.length === 0 || dataset2.clicks.length === 0;

  return (
    <EmptyChartContainer>
      {isEmpty && <EmptyChart />}
      {!isEmpty && (
        <AreaChart
          xTicks={xTicks}
          aspectRatio={aspectRatio}
          dataset={dataset2}
          startDate={startDate}
          endDate={endDate}
        />
      )}

    </EmptyChartContainer>
  );
});

export default React.memo(ImpressionClicksChartConnect);
