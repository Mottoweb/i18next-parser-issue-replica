import React from 'react';
import { Tooltip, Icons } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import { CampaignPositionDto } from '@adnz/api-ws-salesforce';
import Colors from 'src/theme/Colors';

export interface IStateLabel {
  position: CampaignPositionDto
}

const StateLabel: React.FC<IStateLabel> = ({
  position,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <Tooltip
      dataTestId={position.statusColor && `activated-position-${position.statusColor}-color`}
      tooltip={t(position.statusMessage ?? '')}
      placement="top"
    >
      {position.statusColor === 'green' && (
        <Icons.Stop color={Colors['adnz-green']} />
      )}
      {position.statusColor === 'yellow' && (
        <Icons.Stop color={Colors['adnz-warning']} />
      )}
      {position.statusColor === 'red' && (
        <Icons.Stop color={Colors.Scarlet} />
      )}
    </Tooltip>
  );
};

export default StateLabel;
