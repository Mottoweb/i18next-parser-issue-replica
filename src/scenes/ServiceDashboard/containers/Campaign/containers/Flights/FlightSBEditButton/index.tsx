import React, { useContext } from 'react';
import { CampaignPositionDto } from '@adnz/api-ws-salesforce';
import { useParams } from 'react-router-dom';
import { CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import { CAMPAIGN_STAGES } from 'src/constants';
import { Table } from '@adnz/ui';
import EditButton from './EditButton';
import CloneButton from './CloneButton';
import ToggleActivationButton from './ToggleActivationButton';
import DeleteButton from './DeleteButton';

export interface FlightSBEditButtonProps {
  campaignPosition: CampaignPositionDto,
  rowIndex: number,
}

const FlightSBEditButton:React.FC<FlightSBEditButtonProps> = ({
  campaignPosition,
  rowIndex,
}) => {
  const { type } = useParams<{ type: string }>();
  const { state: { campaign } } = useContext(CampaignToolContext);

  const visible = React.useMemo<boolean>(
    () => (campaign?.stage ?? CAMPAIGN_STAGES.DRAFT) !== CAMPAIGN_STAGES.ARCHIVED,
    [campaign],
  );

  if (!campaign || !campaign.hasPermission || !visible) return null;

  return (
    <Table.Td dataTestId="positions-menu-button" css="width: 1px;" type="action">
      <Table.ActionsList rowIndex={rowIndex}>
        <EditButton type={type} campaign={campaign} campaignPosition={campaignPosition} />
        <CloneButton type={type} campaign={campaign} campaignPosition={campaignPosition} />
        <ToggleActivationButton campaign={campaign} campaignPosition={campaignPosition} />
        <DeleteButton campaign={campaign} campaignPosition={campaignPosition} />
      </Table.ActionsList>
    </Table.Td>
  );
};

export default FlightSBEditButton;
