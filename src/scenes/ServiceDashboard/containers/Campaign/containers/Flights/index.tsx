import React, { useContext, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import orderBy from 'lodash.orderby';
import moment from 'moment';
import { useRequest } from '@adnz/use-request';
import {
  CampaignStage, getLineItemStatesByCampaignId, LineItemStateDto, LineItemStateDtoStateInline,
  CampaignPositionDto, CampaignDto,
} from '@adnz/api-ws-salesforce';
import GroupContainer from 'src/components/GroupContainer';
import { GetGroupId, GetId, GetName } from 'src/components/GroupContainer/types';
import { Button, ButtonGroup, Table } from '@adnz/ui';
import { useIdentityRoles } from '@adnz/use-auth';
import { CAMPAIGN_TYPE_PR, CAMPAIGN_INVOICE_STATE_CHARGED, getSwissAmountFormat } from 'src/constants';
import useSortAndOrder from 'src/hooks/useSortAndOrder';
import { CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import { useCampaignViewabilityIsShown } from 'src/scenes/ServiceDashboard/containers/Campaign/hooks';
import {
  FlightsContextProvider,
} from 'src/scenes/ServiceDashboard/containers/Campaign/containers/Flights/FlightsContext';
import { fromDateTimeType } from '@adnz/api-helpers';
import FlightRow from './FlightRow';
import ShowHistoryButton from './ShowHistoryButton';

interface DigitalPositionHeaderProps {
  id: string,
  name: string,
  positions: CampaignPositionDto[],
  campaign: CampaignDto,
  getGroupId: GetGroupId<CampaignPositionDto>
}

const DigitalPositionHeader: React.FC<DigitalPositionHeaderProps> = ({
  id,
  name,
  positions,
  getGroupId,
  campaign,
}) => {
  const sum = React.useMemo<number | null>(
    () => positions
      .filter((p) => getGroupId(p) === id)
      .reduce(
        (aggr, item) => {
          if (item.showAmount) {
            return (aggr ?? 0) + item.amountNet2;
          }
          return aggr;
        },
        null as number | null,
      ),
    [positions, id, getGroupId],
  );

  return (
    <Table.PositionsGroupTbodyHeader
      key={id}
      name={name}
      summary={sum ? getSwissAmountFormat(campaign.currency).format(sum) : undefined}
    />
  );
};

type IOrder = 'asc' | 'desc';

interface FlightsComponentProps {
  amountHasData: boolean;
  limit?: number;
  type: string;
  isPaymentSucceeded?: boolean;
}

const FlightsComponent: React.FC<FlightsComponentProps> = ({
  amountHasData = false,
  limit = 16,
  type,
  isPaymentSucceeded = true,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { ADMIN, BOOK_CAMPAIGNS } = useIdentityRoles();
  const [show, setShow] = useState(false);
  const { state: { campaign } } = useContext(CampaignToolContext);

  const {
    campaignId,
    campaignType,
    startDate,
    stage,
    invoiceState,
    deliveredConversions,
    isSelfBookedBusinessclick,
  } = (campaign ?? {});

  const [positionStates] = useRequest({
    apiMethod: getLineItemStatesByCampaignId,
    parameters: [{ campaignId: campaignId ?? '' }],
    runOnMount: true,
    onFail: (e) => console.error('Failed getting states', e), // eslint-disable-line no-console
    defaultData: [],
  });

  const hasActiveOrInactiveItems = useMemo(() => positionStates.some(
    ({ state }) => state === LineItemStateDtoStateInline.ACTIVE || state === LineItemStateDtoStateInline.INACTIVE,
  ), [positionStates]);

  const isStatusVisible = hasActiveOrInactiveItems && (ADMIN || BOOK_CAMPAIGNS);

  const positionStateByPositionId = useMemo(() => (positionStates as LineItemStateDto[]).reduce(
    (states, { campaignPositionId, state }) => ({ ...states, [campaignPositionId as string]: state }), {},
  ), [positionStates]);

  const isFutureStart = !!startDate && moment().diff(fromDateTimeType(startDate)) < 0;

  const isCampaignViewabilityShown = useCampaignViewabilityIsShown();

  const hasConversions = !isFutureStart && (deliveredConversions ?? 0) > 0;

  const isEditable = !(
    !campaignType || campaignType.name === CAMPAIGN_TYPE_PR || invoiceState === CAMPAIGN_INVOICE_STATE_CHARGED
  ) && isPaymentSucceeded;

  const isForecastVisible = ADMIN
    && [CampaignStage.BOOKED, CampaignStage.OFFERED].includes(stage as CampaignStage)
    && isFutureStart;

  const [parameters, setParameters] = React.useState({
    sort: 'sortOrder',
    order: 'ASC',
  });

  const campaignPositions = useMemo(
    () => {
      const campainPositionSliced = !show
        ? campaign?.campaignPositions.slice(0, limit)
        : campaign?.campaignPositions;
      return orderBy(campainPositionSliced, [parameters.sort], [parameters.order.toLowerCase() as IOrder]);
    },
    [campaign?.campaignPositions, limit, show, parameters],
  );
  const { getHandleChangeArgument, getOrderArgument } = useSortAndOrder(parameters, setParameters);
  const hasViewability = useMemo(() => ADMIN || !!campaignPositions?.find(
    (i) => !i.name.startsWith('Business Click_') && i.billingType !== 'CPCV',
  ), [campaignPositions, ADMIN]);
  const isViewabilityShown = hasViewability && isCampaignViewabilityShown && !isFutureStart;

  const getId = React.useCallback<GetId<CampaignPositionDto>>(
    (v) => v.id,
    [],
  );

  const getName = React.useCallback<GetName<CampaignPositionDto>>(
    (v) => v.positionGroup?.name,
    [],
  );

  const getGroupId = React.useCallback<GetGroupId<CampaignPositionDto>>(
    (v) => v.positionSubGroupCode,
    [],
  );

  if (!campaignPositions) return null;
  if (!campaign) return null;

  return (
    <FlightsContextProvider
      isStatusVisible={isStatusVisible ?? false}
      isViewabilityShown={isViewabilityShown}
      positionStateByPositionId={positionStateByPositionId as Record<string, LineItemStateDtoStateInline>}
      isEditable={isEditable}
    >
      <Table type="withGroups">
        <thead>
          <Table.Tr>
            <Table.Th
              order={getOrderArgument('sortOrder')}
              handleChangeOrder={getHandleChangeArgument('sortOrder')}
            >
              #
            </Table.Th>
            <Table.Th
              order={getOrderArgument('name')}
              handleChangeOrder={getHandleChangeArgument('name')}
            >
              {t('serviceDashboard:FLIGHT_NAME')}
            </Table.Th>
            <Table.Th
              order={getOrderArgument('fromDate')}
              handleChangeOrder={getHandleChangeArgument('fromDate')}
            >
              {t('serviceDashboard:START_DATE')}
            </Table.Th>
            <Table.Th
              order={getOrderArgument('toDate')}
              handleChangeOrder={getHandleChangeArgument('toDate')}
            >
              {t('serviceDashboard:END_DATE')}
            </Table.Th>
            <Table.Th
              order={getOrderArgument('appNexusId')}
              handleChangeOrder={getHandleChangeArgument('appNexusId')}
            >
              {t('serviceDashboard:LINKS')}
            </Table.Th>
            {isStatusVisible && (
            <Table.Th
              order={getOrderArgument('positionStatus')}
              handleChangeOrder={getHandleChangeArgument('positionStatus')}
            >
              {t('serviceDashboard:STATUS')}
            </Table.Th>
            )}
            <Table.Th
              order={getOrderArgument('total')}
              handleChangeOrder={getHandleChangeArgument('total')}
            >
              {t('serviceDashboard:TOTAL_ITEMS')}
            </Table.Th>
            {!isFutureStart && (
            <Table.Th
              order={getOrderArgument('deliveredItems')}
              handleChangeOrder={getHandleChangeArgument('deliveredItems')}
            >
              {t('serviceDashboard:DELIVERED')}
            </Table.Th>
            )}
            {!isFutureStart && (
            <Table.Th
              order={getOrderArgument('deliveryRate')}
              handleChangeOrder={getHandleChangeArgument('deliveryRate')}
            >
              {t('serviceDashboard:DELIVERY_INDICATOR')}
            </Table.Th>
            )}
            {!isFutureStart && (
            <Table.Th
              order={getOrderArgument('ctr')}
              handleChangeOrder={getHandleChangeArgument('ctr')}
            >
              {t('serviceDashboard:CTR')}
            </Table.Th>
            )}
            {hasConversions && (
            <Table.Th
              order={getOrderArgument('conversionClickRate')}
              handleChangeOrder={getHandleChangeArgument('conversionClickRate')}
            >
              {t('serviceDashboard:CONVERSION')}
            </Table.Th>
            )}
            {isViewabilityShown && (
            <Table.Th
              order={getOrderArgument('visibility')}
              handleChangeOrder={getHandleChangeArgument('visibility')}
            >
              {t('serviceDashboard:VISIBILITY')}
            </Table.Th>
            )}
            {isForecastVisible && (
            <Table.Th>
              {t('serviceDashboard:FORECAST')}
            </Table.Th>
            )}
            {amountHasData && (
            <Table.Th
              order={getOrderArgument('amountNet2')}
              handleChangeOrder={getHandleChangeArgument('amountNet2')}
            >
              {t('serviceDashboard:AMOUNT_NET2')}
            </Table.Th>
            )}
          </Table.Tr>
        </thead>
        <GroupContainer<CampaignPositionDto>
          values={campaignPositions}
          getId={getId}
          getGroupId={getGroupId}
          getName={getName}
          renderGroupHeader={(id, name) => (
            <DigitalPositionHeader
              id={id}
              name={name}
              getGroupId={getGroupId}
              positions={campaignPositions}
              campaign={campaign}
            />
          )}
          renderRow={(position, index) => (
            <FlightRow
              key={position.id}
              index={index}
              campaign={campaign}
              appNexusId={position.appNexusIds[0]}
              isSelfBookedBusinessclick={isSelfBookedBusinessclick}
              hasConversions={hasConversions}
              amountHasData={amountHasData}
              item={position}
              isFutureStart={isFutureStart}
              isForecastVisible={isForecastVisible ?? false}
            />
          )}
          renderGroupFooter={() => <Table.PositionsGroupTbodyFooter />}
        />
      </Table>
      <ButtonGroup spacer="top" css="display: flex;justify-content: space-between;">
        {campaign && (
          <ShowHistoryButton campaign={campaign} type={type} />
        )}
        {(campaign?.campaignPositions.length ?? 0) > limit && (
        <>
          {!show && (
          <Button
            theme="create-secondary"
            onClick={() => setShow(true)}
          >
            {t('serviceDashboard:SHOW_MORE')}
          </Button>
          )}
          {show && (
          <Button
            onClick={() => setShow(false)}
            theme="create-secondary"
          >
            {t('serviceDashboard:SHOW_LESS')}
          </Button>
          )}
        </>
        )}
      </ButtonGroup>
    </FlightsContextProvider>
  );
};

export default FlightsComponent;
