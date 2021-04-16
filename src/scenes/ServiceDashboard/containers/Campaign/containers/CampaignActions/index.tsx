import React from 'react';
import { ButtonGroup } from '@adnz/ui';
import { useRequest } from '@adnz/use-request';
import { CampaignDto, CampaignStage } from '@adnz/api-ws-salesforce';
import { getCampaignById } from '@adnz/api-ws-invoices';
import { useIdentityRoles, Roles, PrivateRoute } from '@adnz/use-auth';
import EditButton from './EditButton';
import DropdownButton from './Dropdown';

const CampaignActions:React.FC<{ campaign: CampaignDto }> = ({
  campaign,
}) => {
  const {
    campaignId,
    stage,
    campaignPositions,
    hasPermission,
  } = campaign;
  const [{ entityId }] = useRequest({
    apiMethod: getCampaignById,
    defaultData: { entityId: undefined },
    parameters: [{ entityId: campaignId }],
  });
  const { BOOK_CAMPAIGNS, SELF_BOOKING, ADMIN_INVOICE } = useIdentityRoles();
  const checkDeliveredItems = campaignPositions.map((position) => position.deliveredItems).some((c) => c && c > 0);
  const checkedStage = [CampaignStage.BOOKED, CampaignStage.PERFORMANCE].some((i) => i === stage);
  const showDropdownButton = checkDeliveredItems || BOOK_CAMPAIGNS
  || SELF_BOOKING
  || (checkedStage && entityId && ADMIN_INVOICE);

  return (
    <ButtonGroup>
      {hasPermission && (
        <PrivateRoute
          roles={[Roles.BOOK_CAMPAIGNS, Roles.SELF_BOOKING]}
          render={() => (
            <EditButton campaign={campaign} />
          )}
        />
      )}
      {showDropdownButton && (
        <DropdownButton
          entityId={entityId}
          campaign={campaign}
          checkDeliveredItems={checkDeliveredItems}
          data-testid="dropdown-container-button"
        />
      )}
    </ButtonGroup>
  );
};

export default CampaignActions;
