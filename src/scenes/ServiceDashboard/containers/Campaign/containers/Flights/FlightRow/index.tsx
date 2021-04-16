import React, { useState } from 'react';
import { SWISS_NUMBER_FORMAT } from 'src/constants';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab } from 'src/components/Tabs';
import useTabs, { TabType } from 'src/components/Tabs/useTabs';
import StateLabel
  from 'src/scenes/ServiceDashboard/containers/Campaign/containers/Flights/FlightRow/components/StateLabel';
import FlightSBEditButton from 'src/scenes/ServiceDashboard/containers/Campaign/containers/Flights/FlightSBEditButton';
import {
  Table, Button, Icons, DropdownList,
} from '@adnz/ui';
import { useIdentityRoles, Roles, PrivateRoute } from '@adnz/use-auth';
import { useFlightsContext } from 'src/scenes/ServiceDashboard/containers/Campaign/containers/Flights/FlightsContext';
import { FlightLeads } from 'src/scenes/ServiceDashboard/containers/Campaign/containers/Flights/FlightLeads';
import CustomCell from 'src/components/CustomCell';
import { CampaignDto, CampaignPositionDto } from '@adnz/api-ws-salesforce';
import { fromDateTimeType } from '@adnz/api-helpers';
import { CampaignPositionStatusToggle } from './components/CampaignPositionStatusToggle';
import ViewabilityIndicator from '../../../../../ViewabilityIndicator';
import CtrIndicator from '../CtrIndicator';
import Screenshots from '../Screenshots';
import FlightChart from '../../FlightChart';
import {
  Name,
} from './styles';

type TabInterface = {
  isBC: boolean,
  isCpcvBillingType: boolean,
  campaignPositionId: string,
  startDate: string,
  endDate: string,
};

const tabs: TabType<TabInterface>[] = [
  {
    key: 'statistic',
    name: 'STATISTICS',
    component: (props) => <FlightChart {...props} />,
  },
  {
    key: 'screenshots',
    name: 'SCREENSHOTS',
    component: ({ campaignPositionId }) => (
      <div id="screenshot-positions-container" css="width: 100%;">
        <Screenshots positionId={campaignPositionId} />
      </div>
    ),
  },
  {
    key: 'leads',
    name: 'LEADS',
    component: ({ campaignPositionId }) => (
      <FlightLeads campaignPositionId={campaignPositionId} />
    ),
  },
];
interface IFlightRow {
  appNexusId?: number,
  campaign?: CampaignDto;
  item: CampaignPositionDto,
  amountHasData?: boolean,
  isSelfBookedBusinessclick?: boolean,
  isFutureStart: boolean,
  isForecastVisible: boolean,
  hasConversions: boolean,
  index: number,
  dataTestId?: string,
}

const FlightRow: React.FC<IFlightRow> = ({
  campaign,
  item,
  amountHasData = false,
  hasConversions,
  appNexusId = 0,
  isSelfBookedBusinessclick = false,
  isFutureStart,
  isForecastVisible,
  dataTestId,
  index,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [toggled, toggle] = useState(false);
  const { ADMIN } = useIdentityRoles();

  const {
    isStatusVisible, isViewabilityShown, positionStateByPositionId, isEditable,
  } = useFlightsContext();

  const toggleRow = React.useCallback(
    () => toggle((v) => !v),
    [toggle],
  );

  const isCpcvBillingType = item.billingType === ('CPCV');
  const {
    tabContent,
    current: currentTab,
    selectTab,
  } = useTabs<TabInterface>({ tabs: tabs.map((tab) => tab.component), defaultTab: 0 });
  const { campaignPositionId } = item;

  return (
    <>
      <Table.Tbody
        dataTestId="positions-table"
        inGroup={!!item.positionGroup}
        isOpen={toggled}
        data-testid={dataTestId}
        subContent={(
          <div css="display:flex; margin: 5px 0;">
            <Tabs css="padding: 8px 30px;border-right: 1px solid #f5f5f5;" vertical>
              {
                tabs.map(
                  (tab, tabIndex) => (
                    <Tab
                      onClick={() => selectTab(tabIndex)}
                      key={tab.key}
                      selected={currentTab === tabIndex}
                    >
                      {t(tab.name)}
                    </Tab>
                  ),
                )
              }
            </Tabs>
            {tabContent({
              isBC: item.name.startsWith('Business Click_'),
              isCpcvBillingType,
              campaignPositionId,
              startDate: fromDateTimeType(item.fromDate).format('x'),
              endDate: fromDateTimeType(item.toDate).format('x'),
            })}
          </div>
        )}
      >
        <Table.Tr
          key={campaignPositionId}
          rowIndex={index}
          onClick={toggleRow}
          data-testid={dataTestId}
        >
          <Table.Td css="width: 1px;" dataTestId="active-inactive-box">
            <div css="display: flex; align-items: center;">
              <span css="min-width: 24px;">
                {item.sortOrder}
              </span>
              <StateLabel position={item} />
            </div>
          </Table.Td>
          <Table.Td css="width: 100%;" type="action">
            <Name>
              <span>
                {item.adMedium.name}
                <br />
              </span>
              <span>
                {item.placement.name}
                <br />
              </span>
              <span>
                {item.adTypeName}
              </span>
            </Name>
          </Table.Td>
          <CustomCell.Date
            value={fromDateTimeType(item.fromDate)}
            title={t('serviceDashboard:START_DATE')}
            inline
            md={2}
          />
          <CustomCell.Date
            value={fromDateTimeType(item.toDate)}
            title={t('serviceDashboard:END_DATE')}
            inline
            md={2}
          />
          <Table.Td>
            {((!!appNexusId && ADMIN) || item.previewLinks.length > 0) && (
              <DropdownList theme="edit" inThead>
                {!!appNexusId && ADMIN && (
                  <DropdownList.Item
                    data-testid="campaign-appnexus-link"
                    externalLink={`${item?.adMedium?.adServerLinkPrefix}${appNexusId}`}
                  >
                    {t('serviceDashboard:APPNEXUS_LINK')}
                  </DropdownList.Item>
                )}
                {item.previewLinks.slice(0, 5).map((previewLink: string | undefined) => (
                  <DropdownList.Item externalLink={previewLink}>
                    {t('serviceDashboard:PREVIEW_LINK')}
                  </DropdownList.Item>
                ))}
              </DropdownList>
            )}
          </Table.Td>
          {isStatusVisible && (
            <Table.Td>
              <CampaignPositionStatusToggle
                status={positionStateByPositionId[campaignPositionId]}
                campaignPositionId={campaignPositionId}
              />
            </Table.Td>
          )}
          <Table.Td>
            {!!item.total && SWISS_NUMBER_FORMAT.format(item.total ?? 0)}
          </Table.Td>
          {!isFutureStart && (
            <>
              <Table.Td>
                {!!item.deliveredItems && SWISS_NUMBER_FORMAT.format(item.deliveredItems ?? 0)}
              </Table.Td>
              <CustomCell.Label
                value={item.deliveryRate && (item.deliveryRate > 500)
                  ? '> 500%' : item.deliveryRate.toFixed(2)}
                statusColor={item.deliveryRateColor}
                title={t('serviceDashboard:DELIVERY_RATE')}
                md={2}
              />
              <CtrIndicator
                ctr={item.ctr}
                flightName={item.name}
              >
                <strong>
                  {t('serviceDashboard:IMPRESSIONS')}
                  :&nbsp;
                </strong>
                {SWISS_NUMBER_FORMAT.format(item.deliveredImpressions ?? 0)}
                <br />
                <strong>
                  {t('serviceDashboard:CLICKS')}
                  :&nbsp;
                </strong>
                {SWISS_NUMBER_FORMAT.format(item.deliveredClicks ?? 0)}
              </CtrIndicator>
              {hasConversions && (
                <CustomCell.Label
                  tooltip={(
                    <>
                      <strong>
                        {t('serviceDashboard:CONVERSIONS')}
                        :&nbsp;
                      </strong>
                      {SWISS_NUMBER_FORMAT.format(item.deliveredConversions ?? 0)}
                      <br />
                      <strong>
                        {t('serviceDashboard:CLICKS')}
                        :&nbsp;
                      </strong>
                      {SWISS_NUMBER_FORMAT.format(item.deliveredClicks ?? 0)}
                    </>
                  )}
                  value={(item.conversionClickRate ?? 0).toFixed(2)}
                  statusColor="green"
                  title={t('serviceDashboard:VISIBILITY')}
                  md={2}
                />
              )}
              {isViewabilityShown && (
                <>
                  {!item.visibility && (
                    <CustomCell.Label title={t('serviceDashboard:VIEWABILITY')} />
                  )}
                  {!!item.visibility && (
                    <PrivateRoute
                      roles={Roles.ADMIN}
                      render={() => (
                        <ViewabilityIndicator
                          viewability={item.visibility}
                          flightName={item.name}
                        />
                      )}
                    />
                  )}
                  {!!item.visibility && !item.name.startsWith('Business Click_') && (
                    <PrivateRoute
                      noRoles={Roles.ADMIN}
                      render={() => (
                        <ViewabilityIndicator
                          viewability={item.visibility}
                          flightName={item.name}
                        />
                      )}
                    />
                  )}
                </>
              )}
            </>
          )}
          {isForecastVisible && (
            <Table.Td className="text-right">
              {SWISS_NUMBER_FORMAT.format(item.forecastAvailable ?? 0)}
            </Table.Td>
          )}
          {amountHasData && (
            <>
              {item.positionGroup ? (
                <Table.Td>
                  -
                </Table.Td>
              ) : (
                <CustomCell.Amount
                  css="width: 100%;"
                  value={item.amountNet2}
                  currency={item.currency}
                  children={!isSelfBookedBusinessclick && !isEditable && (
                    <Button dataTestId="open-position-info-Button" icon>
                      <Icons.Angle
                        size={14}
                        direction={toggled ? undefined : 'right'}
                      />
                    </Button>
                  )}
                  type={(!isSelfBookedBusinessclick && !isEditable) ? 'action' : undefined}
                />
              )}
            </>
          )}
          {isSelfBookedBusinessclick && isEditable && <FlightSBEditButton rowIndex={index} campaignPosition={item} />}
        </Table.Tr>
        {item.info && (
          <Table.AdditionalRow
            title={t('serviceDashboard:NOTE_POSITION')}
            text={item.info}
            dataTestId="position-comment"
          />
        )}
        {campaign?.hasPermission && item.internalComment && (
          <Table.AdditionalRow
            title={t('serviceDashboard:INTERNAL_COMMENT')}
            text={item.internalComment}
            dataTestId="position-internal-comment"
          />
        )}
      </Table.Tbody>
    </>
  );
};

export default React.memo(FlightRow);
