import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SWISS_NUMBER_FORMAT } from 'src/constants';
import { useCampaignPositionViewabilityIsShown } from 'src/scenes/ServiceDashboard/containers/Campaign/hooks';
import { Table } from '@adnz/ui';
import * as selectors from '../selector';
import * as actions from '../actions';
import {
  InTableContainer, InTableRow, InTableThead, InTableSortBtn,
} from '../styles';

const DayTable = ({
  campaignPositionId,
  isCpcvBillingType,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const orderBy = React.useCallback(
    (newOrderField) => dispatch(actions.selectDayOrder(campaignPositionId, newOrderField)),
    [dispatch, campaignPositionId],
  );
  const items = useSelector((state) => selectors.getOrderedItems(state, { itemId: campaignPositionId }));
  const orderField = useSelector((state) => selectors.getDayOrderField(state, { itemId: campaignPositionId }));

  const isPositionViewabilityShown = useCampaignPositionViewabilityIsShown(campaignPositionId);
  const isVideoCompletionsColumnShown = isCpcvBillingType;
  const isViewabilityColumnShown = !isCpcvBillingType && isPositionViewabilityShown;

  return (
    <InTableContainer>
      <Table>
        <InTableThead>
          <Table.Tr>
            <Table.Th>
              <InTableSortBtn
                active={orderField === 'date'}
                onClick={() => orderBy('date')}
              >
                {t('serviceDashboard:DATE')}
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
            <Table.Th>
              <InTableSortBtn
                active={orderField === 'conversionClickRate'}
                onClick={() => orderBy('conversionClickRate')}
              >
                {t('serviceDashboard:CONVERSION_CLICK_RATE')}
              </InTableSortBtn>
            </Table.Th>
            <Table.Th>
              <InTableSortBtn
                active={orderField === 'conversions'}
                onClick={() => orderBy('conversions')}
              >
                {t('serviceDashboard:CONVERSIONS')}
              </InTableSortBtn>
            </Table.Th>
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
            <InTableRow key={item.get('date')}>
              <Table.Td type="initial">{item.get('date')}</Table.Td>
              <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.get('impressions'))}</Table.Td>
              <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.get('clicks'))}</Table.Td>
              <Table.Td type="initial">
                {item.get('ctr')}
                %
              </Table.Td>
              <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.get('conversionClickRate'))}</Table.Td>
              <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.get('conversions'))}</Table.Td>
              {isVideoCompletionsColumnShown && (
                <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.get('videoCompletions'))}</Table.Td>
              )}
              {isViewabilityColumnShown && (
                <Table.Td type="initial">{SWISS_NUMBER_FORMAT.format(item.get('viewability'))}</Table.Td>
              )}
            </InTableRow>
          ))}
        </tbody>
      </Table>
    </InTableContainer>
  );
};

DayTable.propTypes = {
  campaignPositionId: PropTypes.string.isRequired,
  isCpcvBillingType: PropTypes.bool.isRequired,
};

export default DayTable;
