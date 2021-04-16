import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@adnz/ui';
import { useHistory } from 'react-router-dom';

const ShowHistoryButton = ({
  campaign,
  type,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const url = campaign.isSelfBookedBusinessclick
    ? `/buy-side/campaigns/${type}/${campaign.campaignId}/sb-history`
    : `/buy-side/campaigns/${type}/${campaign.campaignId}/history`;

  if (!campaign.hasPermission) return null;
  return (
    <Button
      id="show-history-button"
      onClick={() => history.push(url)}
      theme="create-secondary"
    >
      {t('serviceDashboard:SHOW_HISTORY')}
    </Button>
  );
};

export default ShowHistoryButton;
