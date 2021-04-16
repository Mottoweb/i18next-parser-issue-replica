import React from 'react';
import PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import { Tooltip, Tag } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import * as helpers from '../../../../../Campaigns/helpers';

const Cell = ({ deliveryRate, deliveryStatus }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <>
      <Responsive maxWidth={991}>
        <p className="mobile-cell__label">
          {t('serviceDashboard:DELIVERY_RATE')}
        </p>
      </Responsive>
      <Tag
        color={deliveryStatus}
        value={deliveryRate}
      />
    </>
  );
};

Cell.propTypes = {
  deliveryRate: PropTypes.string.isRequired,
  deliveryStatus: PropTypes.string.isRequired,
};

export const CellWithTooltip = ({
  campaign,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  if (!campaign.deliveryRate || !campaign.deliveryRateColor) return null;
  const deliveryRate = campaign.deliveryRate > 500 ? '> 500%' : `${campaign.deliveryRate.toFixed(2)}%`;
  const deliveryStatus = helpers.getStatus(campaign.deliveryRateColor);
  return (
    <Tooltip
      placement="top"
      tooltip={t(campaign.deliveryRateMessage)}
    >
      <div>
        <Cell deliveryRate={deliveryRate} deliveryStatus={deliveryStatus} />
      </div>
    </Tooltip>
  );
};

CellWithTooltip.propTypes = {
  campaign: PropTypes.shape({
    campaignId: PropTypes.string,
    deliveryRate: PropTypes.number,
    deliveryRateColor: PropTypes.string,
    deliveryRateMessage: PropTypes.string,
  }),
};

CellWithTooltip.defaultProps = {
  campaign: undefined,
};

export default CellWithTooltip;
