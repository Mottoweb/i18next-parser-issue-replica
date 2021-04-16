import React from 'react';
import PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import { Tooltip, Tag } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import * as helpers from 'src/scenes/Campaigns/helpers';

const Cell = ({ visibility, visibilityStatus }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <>
      <Responsive maxWidth={991}>
        <p className="mobile-cell__label">
          {t('serviceDashboard:VISIBILITY')}
        </p>
      </Responsive>
      <Tag
        color={visibilityStatus}
        value={visibility}
      />
    </>
  );
};

Cell.propTypes = {
  visibility: PropTypes.string.isRequired,
  visibilityStatus: PropTypes.string.isRequired,
};

export const CellWithTooltip = ({
  campaign,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const visibility = campaign.visibility ? campaign.visibility.toFixed(2) : null;
  const visibilityStatus = helpers.getStatus(campaign.visibilityColor);
  if (!visibility) return null;
  return (
    <Tooltip
      tooltip={t(campaign.visibilityMessage)}
    >
      <div>
        <Cell visibility={visibility} visibilityStatus={visibilityStatus} />
      </div>
    </Tooltip>
  );
};

CellWithTooltip.propTypes = {
  campaign: PropTypes.shape({
    campaignId: PropTypes.string,
    visibility: PropTypes.number,
    visibilityColor: PropTypes.string,
    visibilityMessage: PropTypes.string,
  }),
};

CellWithTooltip.defaultProps = {
  campaign: undefined,
};

export default CellWithTooltip;
