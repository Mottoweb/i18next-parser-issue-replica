import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CampaignChart from 'src/components/CampaignChart';
import { SWISS_NUMBER_FORMAT } from 'src/constants';
import { Tabs, Tab } from 'src/components/Tabs';
import { useTooltip } from '@adnz/use-tooltip';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import LoaderComponent from 'src/components/Loader';
import ErrorComponent from 'src/components/Error';
import { useIdentityRoles } from '@adnz/use-auth';
import { useCampaignPositionViewabilityIsShown } from 'src/scenes/ServiceDashboard/containers/Campaign/hooks';
import BarsChart from '../../components/BarsChart';
import * as actions from './actions';
import * as selectors from './selector';
import DayTable from './DayTable';
import ViewabilityTable from './ViewabilityTable';
import CreativeTable from './CreativeTable';
import { formatText } from './helpers';
import { TabsContainer } from './styles';

const paramTabs = [
  {
    key: 'impressions',
    name: 'IMPRESSIONS',
  },
  {
    key: 'ctr',
    name: 'CTR',
  },
  {
    key: 'clicks',
    name: 'CLICKS',
  },
  {
    key: 'viewability',
    name: 'VIEWABILITY',
  },
  {
    key: 'videoCompletions',
    name: 'VIDEO_COMPLETIONS',
  },
  {
    key: 'conversionClickRate',
    name: 'CONVERSION_CLICK_RATE',
  },
  {
    key: 'conversions',
    name: 'CONVERSIONS',
  },
];

const typeTabs = [
  {
    key: 'day',
    name: 'TIME',
  },
  {
    key: 'website',
    name: 'WEBSITE',
  },
  {
    key: 'creative',
    name: 'CREATIVES',
  },
];

const hideTabDefault = (isCpcvBillingType, key) => {
  const hideVideoCompletions = !isCpcvBillingType && key === 'videoCompletions';
  const hideViewability = isCpcvBillingType && key === 'viewability';
  return (hideVideoCompletions || hideViewability);
};

const FlightChartInner = ({
  showImpressions,
  showCTR,
  showClicks,
  campaignPositionId,
  isCpcvBillingType,
  ...props
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { ADMIN } = useIdentityRoles();
  const data = useSelector((state) => selectors.getFlightChartData(state, { itemId: campaignPositionId }));
  const type = useSelector((state) => selectors.getFlightChartType(state, { itemId: campaignPositionId }));
  const param = useSelector((state) => selectors.getFlightChartParam(state, { itemId: campaignPositionId }));
  const labels = useSelector((state) => selectors.getLabels(state, { itemId: campaignPositionId }));
  const dataset = useSelector((state) => selectors.getBarsChartData(state, { itemId: campaignPositionId }));
  const creativeDataset = useSelector(
    (state) => selectors.getCreativeBarsChartData(state, { itemId: campaignPositionId }),
  );

  const [showTooltip, hideTooltip] = useTooltip();
  const domainXOnMouseOver = React.useCallback(
    (evt, text) => showTooltip(evt.x + 10, evt.y + 10, <div>{text}</div>),
    [showTooltip],
  );
  const domainXOnMouseOut = React.useCallback(
    () => hideTooltip(),
    [hideTooltip],
  );

  const dispatch = useDispatch();
  const handleSelectType = React.useCallback(
    (newType) => dispatch(actions.selectFlightChartType(campaignPositionId, newType)),
    [campaignPositionId, dispatch],
  );
  const handleSelectParam = React.useCallback(
    (newParam) => dispatch(actions.selectFlightChartParam(campaignPositionId, newParam)),
    [campaignPositionId, dispatch],
  );
  const onMouseOver = React.useCallback(
    (evt, date, val, type1) => {
      if (type1) {
        return showTooltip(evt.x + 10, evt.y + 10, (
          <div>
            <div>{t(type1)}</div>
            <div>
              <strong>
                {date}
                :
                {' '}
              </strong>
              {type1.toLowerCase() === 'ctr' ? `${val}%` : SWISS_NUMBER_FORMAT.format(val)}
            </div>
          </div>
        ));
      }

      return null;
    },
    [t, showTooltip],
  );
  const onMouseOut = React.useCallback(
    () => hideTooltip(),
    [hideTooltip],
  );

  const isVisibilityTabShown = useCampaignPositionViewabilityIsShown(campaignPositionId);

  const filteredParamTabs = React.useMemo(
    () => paramTabs.filter(({
      hide: hideTab = hideTabDefault,
      key,
    }) => {
      if (key === 'viewability' && !isVisibilityTabShown) {
        return false;
      }
      return !hideTab(isCpcvBillingType, key, { isAdmin: ADMIN });
    }),
    [ADMIN, isVisibilityTabShown, isCpcvBillingType],
  );

  return (
    <div css="width:100%;">
      <TabsContainer>
        <Tabs>
          {typeTabs.map(({ key, name }) => (
            <Tab
              key={key}
              onClick={() => handleSelectType(key)}
              selected={key === type}
            >
              {t(name)}
            </Tab>
          ))}
        </Tabs>
        <Tabs>
          {filteredParamTabs.map(({ key, name }) => (
            <Tab
              key={key}
              selected={key === param}
              onClick={() => handleSelectParam(key)}
            >
              {t(name)}
            </Tab>
          ))}
        </Tabs>
      </TabsContainer>
      <div>
        <div className="rel">
          {param !== 'viewability-publisher' && (
            <>
              {type === 'day' && (
                <CampaignChart
                  data={data}
                  onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut}
                  domainXOnMouseOver={domainXOnMouseOver}
                  domainXOnMouseOut={domainXOnMouseOut}
                  formatText={formatText}
                  {...props}
                  title="Data"
                />
              )}
              {type !== 'day' && type !== 'creative' && (
                <BarsChart
                  size={{ width: 1132 }}
                  aspectRatio={4}
                  dataset={dataset}
                  onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut}
                  domainXOnMouseOver={domainXOnMouseOver}
                  domainXOnMouseOut={domainXOnMouseOut}
                  formatText={formatText}
                  {...props}
                  visibleYAxis
                  ellipsize
                  type={type}
                  param={param}
                />
              )}
              {type !== 'day' && type !== 'website' && (
                <BarsChart
                  size={{ width: 1132 }}
                  aspectRatio={4}
                  dataset={creativeDataset}
                  onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut}
                  domainXOnMouseOver={domainXOnMouseOver}
                  domainXOnMouseOut={domainXOnMouseOut}
                  formatText={formatText}
                  {...props}
                  visibleYAxis
                  ellipsize
                  type={type}
                  param={param}
                />
              )}
            </>
          )}
        </div>
        {type !== 'website' && type !== 'creative' && (
        <DayTable
          campaignPositionId={campaignPositionId}
          isCpcvBillingType={!!isCpcvBillingType}
        />
        )}
        {type !== 'day' && type !== 'creative' && (
        <ViewabilityTable
          campaignPositionId={campaignPositionId}
          isCpcvBillingType={!!isCpcvBillingType}
        />
        )}
        {type === 'creative' && (
        <CreativeTable
          campaignPositionId={campaignPositionId}
          isCpcvBillingType={!!isCpcvBillingType}
        />
        )}
        <>
          {type === 'day' && labels.size > 0 && (
            <ul className="flight-chart-labels flight-chart-labels--archived">
              <li className="flight-chart-labels__title">
                <span>
                  {t('serviceDashboard:DELIVERY_DATA_LAST_UPDATE_LABEL')}
                  {labels.map((label, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={i}>
                      {labels.size !== i + 1 && ', '}
                      <span>
                        {t(label.get('name'))}
                        :
                        {' '}
                        {label.get('value')}
                      </span>
                    </React.Fragment>
                  ))}
                </span>
              </li>
            </ul>
          )}
          {type !== 'day' && labels.size > 0 && (
            <ul className="flight-chart-labels flight-chart-labels--archived">
              <li className="flight-chart-labels__title">
                <span>
                  {t('serviceDashboard:DELIVERY_DATA_LAST_UPDATE_LABEL')}
                  {labels.map((label, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={i}>
                      {labels.size !== i + 1 && ', '}
                      <span>
                        {t(label.get('name'))}
                        :
                        {' '}
                        {label.get('value')}
                      </span>
                    </React.Fragment>
                  ))}
                </span>
              </li>
            </ul>
          )}
        </>
      </div>
    </div>
  );
};

FlightChartInner.propTypes = {
  showImpressions: PropTypes.bool.isRequired,
  showCTR: PropTypes.bool.isRequired,
  showClicks: PropTypes.bool.isRequired,
  campaignPositionId: PropTypes.string.isRequired,
  isBC: PropTypes.bool.isRequired,
  isCpcvBillingType: PropTypes.bool.isRequired,
};

const FlightChartWrapper = ({ campaignPositionId, ...props }) => {
  const dispatch = useDispatch();
  const { loading, error } = useEffectWithToken(
    (token) => Promise.all([
      dispatch(actions.getFlightChartData(token, campaignPositionId)),
      dispatch(actions.getViewability(token, campaignPositionId)),
      dispatch(actions.getCreativeData(token, campaignPositionId)),
    ]),
    [dispatch, campaignPositionId],
    true,
  );
  if (loading) {
    return <LoaderComponent />;
  }
  if (error) {
    return <ErrorComponent title={error.message} />;
  }
  return (
    <FlightChartInner
      campaignPositionId={campaignPositionId}
      {...props}
    />
  );
};

FlightChartWrapper.propTypes = {
  campaignPositionId: PropTypes.string.isRequired,
};

export default FlightChartWrapper;
