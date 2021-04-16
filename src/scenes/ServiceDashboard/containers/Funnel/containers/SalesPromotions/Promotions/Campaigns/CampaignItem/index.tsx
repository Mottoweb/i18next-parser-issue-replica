import React from 'react';
import { Link } from 'react-router-dom';
import {
  Label, Checkbox, Table,
} from '@adnz/ui';
import styled from 'styled-components';
import AmountCell from 'src/components/AmountCell';
import { CampaignDto, fromDateTime } from '@adnz/api-ws-salesforce';
import { DATE_FORMAT } from 'src/constants';
import { useDispatch, useSelector } from '../../../context';
import * as selectors from '../../../selectors';
import * as actions from '../../../actions';

const CheckboxContainer = styled(Label)`
  margin: 0;
  justify-content: center;
`;

const CampaignItem: React.FC<{ campaign: CampaignDto, salesPromotionId: string, isOrder: boolean }> = ({
  campaign, isOrder,
}) => {
  const dispatch = useDispatch();
  const selectedCampaignIds = useSelector(selectors.getSelectedCampaigns, [isOrder]);
  const isCheckboxChecked = React.useMemo(
    () => selectedCampaignIds.includes(campaign.campaignId),
    [selectedCampaignIds, campaign.campaignId],
  );

  const selectCampaign = React.useCallback(
    () => dispatch(actions.SELECT_CAMPAIGN({ id: campaign.campaignId, isOrder, isRemove: isCheckboxChecked })),
    [dispatch, campaign.campaignId, isCheckboxChecked, isOrder],
  );

  return (
    <Table.Tr key={campaign.campaignId}>
      <Table.Td css="width: 1px;">
        <CheckboxContainer>
          <Checkbox checked={isCheckboxChecked} onChange={selectCampaign} square />
        </CheckboxContainer>
      </Table.Td>
      <Table.Td>
        <Link to={`/buy-side/campaigns/ALL/${campaign.campaignId}`}>
          {campaign.internalOrderNumber}
        </Link>
        <p className="cell-with-impressions__title">{campaign.campaignName}</p>
      </Table.Td>
      <Table.Td>
        {campaign.advertiserAccount && (
          <>
            <Link to={`/buy-side/accounts/${campaign.advertiserAccount.id}`}>
              {campaign.advertiserAccount.name}
            </Link>
          </>
        )}
      </Table.Td>
      <Table.Td>{fromDateTime(campaign.startDate)?.format(DATE_FORMAT)}</Table.Td>
      <Table.Td>{fromDateTime(campaign.endDate)?.format(DATE_FORMAT)}</Table.Td>
      <Table.Td>{fromDateTime(campaign.created)?.format(DATE_FORMAT)}</Table.Td>
      <AmountCell currency={campaign.currency} value={campaign.amountNet2} />
      <AmountCell currency={campaign.currency} value={campaign.amountNet4} />
      <Table.Td />
    </Table.Tr>
  );
};

export default CampaignItem;
