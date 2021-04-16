import * as React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SWISS_NUMBER_FORMAT } from 'src/constants';
import { useIdentityRoles } from '@adnz/use-auth';
import { useCampaignPositionViewabilityIsShown } from 'src/scenes/ServiceDashboard/containers/Campaign/hooks';
import { Table } from '@adnz/ui';
import * as selectors from '../selector';
import * as actions from '../actions';
import { InTableRow, InTableThead, InTableSortBtn } from '../styles';

type Creative = {
  clicks: number
  creative: string
  ctr: number
  impressions: number
  viewability: number
  videoCompletions: number
  viewabilityImpressions: number
  viewabilityMeasured: number,
  conversionClickRate: number,
  conversions: number,
};

interface ICreativeTable {
  items: Creative[]
  orderBy: (orderField: string) => void
  orderField: string
  campaignPositionId: string
  isCpcvBillingType: boolean
}

const CreativeTable: React.FC<ICreativeTable> = ({
  items,
  orderBy,
  orderField,
  isCpcvBillingType,
  campaignPositionId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { ADMIN } = useIdentityRoles();

  const isPositionViewabilityShown = useCampaignPositionViewabilityIsShown(campaignPositionId);
  const isVideoCompletionsColumnShown = isCpcvBillingType;
  const isViewabilityColumnShown = !isCpcvBillingType && isPositionViewabilityShown;

  return (
    <Table>
      <InTableThead>
        <Table.Tr>
          <Table.Th>
            <InTableSortBtn
              active={orderField === 'creative'}
              onClick={() => orderBy('creative')}
            >
              {t('serviceDashboard:CREATIVES')}
            </InTableSortBtn>
          </Table.Th>
          <Table.Th>
            <InTableSortBtn
              active={orderField === 'impressions'}
              onClick={() => orderBy('impressions')}
            >
              {t('serviceDashboard:IMPRESSIONS')}
            </InTableSortBtn>
          </Table.Th>
          <Table.Th>
            <InTableSortBtn
              active={orderField === 'clicks'}
              onClick={() => orderBy('clicks')}
            >
              {t('serviceDashboard:CLICKS')}
            </InTableSortBtn>
          </Table.Th>
          <Table.Th>
            <InTableSortBtn
              active={orderField === 'ctr'}
              onClick={() => orderBy('ctr')}
            >
              {t('serviceDashboard:CTR')}
            </InTableSortBtn>
          </Table.Th>
          {ADMIN && (
            <Table.Th>
              <InTableSortBtn
                active={orderField === 'conversionClickRate'}
                onClick={() => orderBy('conversionClickRate')}
              >
                {t('serviceDashboard:CONVERSION_CLICK_RATE')}
              </InTableSortBtn>
            </Table.Th>
          )}
          {ADMIN && (
            <Table.Th>
              <InTableSortBtn
                active={orderField === 'conversions'}
                onClick={() => orderBy('conversions')}
              >
                {t('serviceDashboard:CONVERSIONS')}
              </InTableSortBtn>
            </Table.Th>
          )}
          {isVideoCompletionsColumnShown && (
            <Table.Th>
              <InTableSortBtn
                active={orderField === 'videoCompletions'}
                onClick={() => orderBy('videoCompletions')}
              >
                {t('serviceDashboard:VIDEO_COMPLETIONS')}
              </InTableSortBtn>
            </Table.Th>
          )}
          {isViewabilityColumnShown && (
            <Table.Th>
              <InTableSortBtn
                active={orderField === 'viewability'}
                onClick={() => orderBy('viewability')}
              >
                {t('serviceDashboard:VIEWABILITY')}
              </InTableSortBtn>
            </Table.Th>
          )}
        </Table.Tr>
      </InTableThead>
      <tbody>
        {items.map((item) => (
          <InTableRow key={item.creative}>
            <Table.Td type="initial">{item.creative}</Table.Td>
            <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.impressions)}</Table.Td>
            <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.clicks)}</Table.Td>
            <Table.Td type="initial">
              {item.ctr}
              %
            </Table.Td>
            {ADMIN && <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.conversionClickRate)}</Table.Td>}
            {ADMIN && <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.conversions)}</Table.Td>}
            {isVideoCompletionsColumnShown && (
              <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.videoCompletions)}</Table.Td>
            )}
            {isViewabilityColumnShown && (
              <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.viewability)}</Table.Td>
            )}
          </InTableRow>
        ))}
      </tbody>
    </Table>
  );
};

export default connect(
  (state, { campaignPositionId }: ICreativeTable) => ({
    // @ts-expect-error @todo TS2554: Expected 1 arguments, but got 2.
    items: selectors.getCreativesJS(state, { itemId: campaignPositionId }),
    // @ts-expect-error @todo TS2554: Expected 1 arguments, but got 2.
    orderField: selectors.getCreativeOrderField(state, { itemId: campaignPositionId }),
  }),
  (dispatch: any, { campaignPositionId }: ICreativeTable) => ({
    orderBy: (orderField: string) => dispatch(actions.selectCreativeOrder(campaignPositionId, orderField)),
  }),
)(CreativeTable);
