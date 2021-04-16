import React from 'react';
import { Button, ButtonGroup, Table } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import { CampaignDto, CampaignPositionType } from '@adnz/api-ws-salesforce';
import {
  getCampaignPositions, getCampaignPositionsParameters, CampaignPositionDto,
} from '@adnz/api-ws-print';
import { getSwissAmountFormat } from 'src/constants';
import { useRequest } from '@adnz/use-request';
import useSortAndOrder from 'src/hooks/useSortAndOrder';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import SectionTitle from 'src/components/SectionTitle';
import EditPositionsButton from 'src/scenes/ServiceDashboard/containers/Campaign/components/EditPositionsButton';
import { TitleContainer } from 'src/scenes/ServiceDashboard/containers/Campaign/components/TitleContainer';
import GroupContainer from 'src/components/GroupContainer';
import { GetGroupId, GetId, GetName } from 'src/components/GroupContainer/types';
import ShowHistoryButton from '../Flights/ShowHistoryButton';

import PrintPositionRow from './components/PrintPositionRow';

interface PrintPositionProps {
  campaign: CampaignDto,
  showEditButton: boolean;
  type: string,
  limit?: number,
}

interface PrintPositionHeaderProps {
  id: string,
  name: string,
  positions: CampaignPositionDto[],
  campaign: CampaignDto,
  getGroupId: GetGroupId<CampaignPositionDto>
}

const PrintPositionHeader: React.FC<PrintPositionHeaderProps> = ({
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

const PrintPositions: React.FC<PrintPositionProps> = ({
  type,
  campaign,
  showEditButton,
  limit = 16,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [show, setShow] = React.useState<boolean>(false);

  const [parameters, setParameters] = React.useState<Partial<getCampaignPositionsParameters>>({
    sort: 'sortOrder',
    order: 'ASC',
  });

  const {
    getHandleChangeArgument,
    getOrderArgument,
  } = useSortAndOrder(parameters, setParameters);
  const [positions, { pending }] = useRequest({
    apiMethod: getCampaignPositions,
    parameters: [{
      campaignId: campaign?.campaignId,
      limit: 1000,
      ...parameters,
    }],
    defaultData: {
      items: [] as CampaignPositionDto[],
    },
  });
  const handleShowMore = React.useCallback(
    () => setShow(true),
    [setShow],
  );
  const handleShowLess = React.useCallback(
    () => setShow(false),
    [setShow],
  );

  const amountHasData = React.useMemo(() => positions.items.some((position) => !!position.id), [positions]);
  const isAmountShown = amountHasData && !campaign.selfBooked;

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

  if (!amountHasData) {
    return null;
  }

  return (
    <PrivateRoute
      roles={Roles.MANAGE_PRINT_PRODUCTS}
      render={() => (
        <>
          <div css="display: flex;justify-content: space-between;align-items: center;">
            <TitleContainer>
              <SectionTitle>{t('serviceDashboard:PRINT_POSITIONS')}</SectionTitle>
            </TitleContainer>
            <PrivateRoute
              roles={Roles.BOOK_CAMPAIGNS}
              render={() => (
                <div
                  className="default-btn-group default-btn-group_aic default-btn-group_right"
                  data-testid="print-positions"
                >
                  {showEditButton && (
                    <EditPositionsButton campaign={campaign} positionType={CampaignPositionType.PRINT} />
                  )}
                </div>
              )}
            />
          </div>
          <div>
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
                    order={getOrderArgument('publicationDate')}
                    handleChangeOrder={getHandleChangeArgument('publicationDate')}
                  >
                    {t('serviceDashboard:PUBLICATION_DATE')}
                  </Table.Th>
                  <Table.Th
                    order={getOrderArgument('materialDeadline')}
                    handleChangeOrder={getHandleChangeArgument('materialDeadline')}
                  >
                    {t('serviceDashboard:MATERIAL_DEADLINE')}
                  </Table.Th>
                  <Table.Th>
                    {t('serviceDashboard:FORMAT_SIZE')}
                  </Table.Th>
                  <Table.Th>
                    {t('serviceDashboard:PRODUCTION_SIZE')}
                  </Table.Th>
                  <Table.Th
                    order={getOrderArgument('color')}
                    handleChangeOrder={getHandleChangeArgument('color')}
                  >
                    {t('serviceDashboard:COLOR')}
                  </Table.Th>
                  {isAmountShown && (
                    <Table.Th
                      order={getOrderArgument('amountNet2')}
                      handleChangeOrder={getHandleChangeArgument('amountNet2')}
                    >
                      {t('serviceDashboard:AMOUNT_N2')}
                    </Table.Th>
                  )}
                </Table.Tr>
              </thead>
              {pending && (
                <Table.Loader columnsLength={8} />
              )}
              {!pending && (
                <>
                  <GroupContainer<CampaignPositionDto>
                    values={positions.items.slice(0, show ? undefined : limit)}
                    getId={getId}
                    getGroupId={getGroupId}
                    getName={getName}
                    renderGroupHeader={(id, name) => (
                      <PrintPositionHeader
                        id={id}
                        name={name}
                        getGroupId={getGroupId}
                        positions={positions.items}
                        campaign={campaign}
                      />
                    )}
                    renderRow={(position) => (
                      <PrintPositionRow
                        key={position.id}
                        campaign={campaign}
                        isAmountShown={isAmountShown}
                        position={position}
                      />
                    )}
                    renderGroupFooter={() => <Table.PositionsGroupTbodyFooter />}
                  />
                </>
              )}
            </Table>
            <ButtonGroup spacer="top" css="display: flex;justify-content: space-between;">
              <ShowHistoryButton campaign={campaign} type={type} />
              {positions.items.length > limit && (
                <>
                  {!show && (
                    <Button
                      theme="create-secondary"
                      onClick={handleShowMore}
                    >
                      {t('serviceDashboard:SHOW_MORE')}
                    </Button>
                  )}
                  {show && (
                    <Button
                      onClick={handleShowLess}
                      theme="create-secondary"
                    >
                      {t('serviceDashboard:SHOW_LESS')}
                    </Button>
                  )}
                </>
              )}
            </ButtonGroup>
          </div>
        </>
      )}
    />
  );
};

export default PrintPositions;
