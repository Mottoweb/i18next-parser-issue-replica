import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab } from 'src/components/Tabs';
import styled from 'styled-components';
import useTabs from 'src/components/Tabs/useTabs';
import { useDispatch } from 'react-redux';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import LoaderComponent from 'src/components/Loader';
import ErrorComponent from 'src/components/Error';
import * as actions from './actions';
import SingleChart from './SingleChart';
import ImpressionClicksChart from './ImpressionClicksChart';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
`;

const tabs = [
  {
    key: 'impressions/clicks',
    name: 'IMPRESSIONS/CLICKS',
    component: ImpressionClicksChart,
  },
  {
    key: 'ctr',
    name: 'CTR',
    component: SingleChart,
  },
];
const tabComponents = tabs.map((tab) => tab.component);

const ChartLayout = ({
  campaignId,
  handleSelect,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { current, tabContent, selectTab } = useTabs({ tabs: tabComponents, defaultTab: 0 });
  return (
    <Container id="graph-container">
      <Tabs>
        {
            tabs.map((tab, index) => (
              <Tab
                key={tab.key}
                selected={current === index}
                onClick={() => { selectTab(index); handleSelect(tab.key); }}
              >
                {t(tab.name)}
              </Tab>
            ))
          }
      </Tabs>
      {tabContent({ campaignId })}
    </Container>
  );
};

ChartLayout.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  campaignId: PropTypes.string.isRequired,
};

const ChartLayoutWrapper = ({ campaignId }) => {
  const dispatch = useDispatch();
  const handleSelect = React.useCallback(
    (param) => dispatch(actions.selectCampaignChart(campaignId, param)),
    [dispatch, campaignId],
  );
  const { loading, error } = useEffectWithToken(
    (token) => dispatch(actions.getCampaignChartData(token, campaignId)),
    [dispatch, campaignId],
    true,
  );
  if (loading) {
    return <LoaderComponent />;
  }
  if (error) {
    return <ErrorComponent title={error.message} />;
  }
  return (
    <ChartLayout
      campaignId={campaignId}
      handleSelect={handleSelect}
    />
  );
};

ChartLayoutWrapper.propTypes = {
  campaignId: PropTypes.string.isRequired,
};

export default ChartLayoutWrapper;
