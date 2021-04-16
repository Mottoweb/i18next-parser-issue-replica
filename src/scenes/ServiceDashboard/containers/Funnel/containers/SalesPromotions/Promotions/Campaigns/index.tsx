import React from 'react';
import {
  Button, ButtonGroup, DropdownList, Table, Section,
} from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import SectionTitle from 'src/components/SectionTitle';
import ToggleAll from 'src/scenes/Workflow/containers/Operations/containers/Booked/containers/CampaignItem/ToggleAll';
import { useRequest } from '@adnz/use-request';
import { CampaignStage, getAgencyCampaigns, toDate } from '@adnz/api-ws-salesforce';
import LoaderComponent from 'src/components/Loader';
import moment from 'moment';
import { DATE_ISO } from '@adnz/api-helpers';
import { useDispatch, useSelector } from '../../context';
import CampaignItem from './CampaignItem';
import * as selectors from '../../selectors';
import * as actions from '../../actions';

const Campaigns: React.FC<{ isOrder: boolean }> = ({ isOrder }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const promotion = useSelector(selectors.getPromotionDetails, []);
  const campaigns = useSelector(selectors.getCampaigns, [isOrder]);
  const isAllCampaignsShown = useSelector(selectors.isAllCampaignsShown, [isOrder]);
  const selectedCampaignIds = useSelector(selectors.getSelectedCampaigns, [isOrder]);
  const isCheckboxChecked = React.useMemo(
    () => selectedCampaignIds.length === campaigns.length,
    [selectedCampaignIds.length, campaigns.length],
  );

  const [, { pending }] = useRequest({
    apiMethod: getAgencyCampaigns,
    parameters: [{
      type: 'ALL',
      campaignIds: promotion?.campaignIds ? promotion?.campaignIds : [],
      orderedAfter: isOrder ? toDate(moment.utc('2000-01-01', DATE_ISO)) : undefined,
      stage: !isOrder ? CampaignStage.OFFERED : undefined,
    }],
    onSuccess: React.useCallback(
      ({ items }) => {
        dispatch(actions.SAVE_CAMPAIGNS({ campaigns: items, isOrder }));
      },
      [dispatch, isOrder],
    ),
  });

  const campaignsToShow = isAllCampaignsShown ? campaigns : campaigns.slice(0, 15);

  const selectAll = () => dispatch(actions.SELECT_CAMPAIGNS({
    ids: campaigns.map((c) => c.campaignId),
    isRemove: isCheckboxChecked,
    isOrder,
  }));

  const toggleShowAll = () => (isOrder
    ? dispatch(actions.TOGGLE_SHOW_ALL_ORDERS()) : dispatch(actions.TOGGLE_SHOW_ALL_OFFERS()));

  return pending && !promotion ? <LoaderComponent /> : (
    <div>
      <div className="table-responsive overflow-y-auto">
        <SectionTitle>
          <span>{isOrder ? t('serviceDashboard:ORDERS') : t('serviceDashboard:OFFERS')}</span>
        </SectionTitle>
        <Section>
          <Table>
            <thead>
              <Table.Tr>
                <Table.Th
                  css="width: 1px;"
                >
                  <ToggleAll checked={isCheckboxChecked} handleChange={selectAll} />
                </Table.Th>
                <Table.Th>{t('serviceDashboard:CAMPAIGN')}</Table.Th>
                <Table.Th>{t('serviceDashboard:ACCOUNT')}</Table.Th>
                <Table.Th>{t('serviceDashboard:START_DATE')}</Table.Th>
                <Table.Th>{t('serviceDashboard:END_DATE')}</Table.Th>
                <Table.Th>{t('serviceDashboard:CREATION_DATE')}</Table.Th>
                <Table.Th>{t('serviceDashboard:AMOUNT_N2')}</Table.Th>
                <Table.Th>{t('serviceDashboard:AMOUNT_N4')}</Table.Th>
                <Table.Th>
                  {/* hidden until xls is implemented */}
                  {false && (
                  <DropdownList
                    id="promotion_campaigns_menu"
                    css="margin-bottom: 5px;"
                    theme="create"
                    inThead
                  >
                    <DropdownList.Item
                      data-testid="generate-campaigns-xls-item"
                      // onClick={() => confirm()}
                      disabled={selectedCampaignIds.length === 0}
                    >
                      {t('serviceDashboard:GENERATE_XLS')}
                    </DropdownList.Item>
                  </DropdownList>
                  )}
                </Table.Th>
              </Table.Tr>
            </thead>
            <tbody className="dash-tbody">
              {campaignsToShow.map((campaign) => (
                <CampaignItem
                  key={campaign.campaignId}
                  campaign={campaign}
                  salesPromotionId={promotion?.id ? promotion?.id : ''}
                  isOrder={isOrder}
                />
              ))}
            </tbody>
          </Table>
        </Section>
      </div>
      <div className="spacer" />
      {campaigns.length > 15 && (
      <ButtonGroup align="right">
        <Button
          onClick={toggleShowAll}
          theme="create-secondary"
        >
          {isAllCampaignsShown ? t('serviceDashboard:SHOW_LESS') : t('serviceDashboard:SHOW_MORE')}
        </Button>
      </ButtonGroup>
      )}
    </div>
  );
};

export default Campaigns;
