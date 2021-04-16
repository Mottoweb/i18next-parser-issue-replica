import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import c from 'classnames';
import Responsive from 'react-responsive';
import { Tooltip, Tag, Icons } from '@adnz/ui';
import { SWISS_NUMBER_FORMAT } from 'src/constants';
import DateCell from 'src/components/DateCell';
import AmountCell from 'src/components/AmountCell';
import * as helpers from 'src/scenes/Campaigns/helpers';
import { useCampaignViewabilityIsShown } from 'src/scenes/ServiceDashboard/containers/Campaign/hooks';
import { fromDateTimeType } from '@adnz/api-helpers';
import DeliveryRate from '../DeliveryRate';
import Visibility from '../Visibility';
import CustomerCell from '../CustomerCell';
import AgencyCampaignNameCell from '../AgencyCampaignNameCell';
import { CampaignToolContext } from '../../context';

const Campaign = ({
  amountHasData,
  type,
  className,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { state: { campaign } } = useContext(CampaignToolContext);
  const isViewabilityVisible = useCampaignViewabilityIsShown();
  const statusColorPropertyName = helpers.getStatusColorPropertyName(type);
  const statusColor = helpers.getStatus(campaign[statusColorPropertyName]);
  const shortcutStatusClass = helpers.getShortcutStatusClass(campaign[statusColorPropertyName]);
  const ctrStatus = helpers.getStatus(campaign.ctrColor);
  const statusMessage = campaign.statusMessages ? campaign.statusMessages.map((s) => t(s)).join('\n') : '';
  const campaignLabel = `STAGE_${campaign.stage}`.toUpperCase();

  return (
    <tbody className={c('dash-tbody', className, shortcutStatusClass)}>
      <tr>
        <Responsive minWidth={992}>
          <td className="dash-td">
            {statusMessage ? (
              <Tooltip
                placement="top"
                tooltip={statusMessage}
                containerComponent="span"
              >
                <Icons.Stop color={statusColor} />
              </Tooltip>
            ) : (
              <Icons.Stop color={statusColor} />
            )}
          </td>
        </Responsive>
        <AgencyCampaignNameCell
          type={type}
          campaign={campaign}
          campaignName={campaign.campaignName}
          campaignLabel={campaignLabel}
          campaignId={campaign.campaignId}
          internalOrderNumber={campaign.internalOrderNumber}
          insightsIndicatorColor={campaign.insightsIndicatorColor}
          insightsIndicatorMessage={campaign.insightsIndicatorMessage}
          responsive
        />
        <CustomerCell
          advertiserAccount={campaign.advertiserAccount}
          responsive
        />
        <DateCell
          value={fromDateTimeType(campaign.startDate)}
          responsive
          responsiveTitle={t('serviceDashboard:START_DATE')}
        />
        <DateCell
          value={fromDateTimeType(campaign.endDate)}
          responsive
          responsiveTitle={t('serviceDashboard:END_DATE')}
        />
        {type === 'OFFERED' && (
        <DateCell
          value={fromDateTimeType(campaign.created)}
          responsive
          responsiveTitle={t('serviceDashboard:CREATION_DATE')}
        />
        )}
        <td style={{ width: 100 }} className="text-center">
          <DeliveryRate campaign={campaign} />
        </td>
        <td style={{ width: 58 }} className="text-center">
          {!!campaign.ctr && (
            <Tooltip
              placement="top"
              tooltip={(
                <div>
                  <strong>
                    {t('serviceDashboard:IMPRESSIONS')}
                    :
                  </strong>
                  {SWISS_NUMBER_FORMAT.format(campaign.deliveredImpressions || 0)}
                  <br />
                  <strong>
                    {t('serviceDashboard:CLICKS')}
                    :
                  </strong>
                  {SWISS_NUMBER_FORMAT.format(campaign.deliveredClicks || 0)}
                </div>
              )}
            >
              <div>
                <Responsive maxWidth={991}>
                  <p className="mobile-cell__label">
                    {t('serviceDashboard:CLICK_TROUGH_RATES_SHORT')}
                  </p>
                </Responsive>
                <span className="label-box">
                  <Tag
                    color={ctrStatus}
                    value={campaign.ctr.toFixed(2)}
                  />
                </span>
              </div>
            </Tooltip>
          )}
        </td>
        {isViewabilityVisible && (
          <td style={{ width: 100 }} className="text-center">
            <Visibility campaign={campaign} />
          </td>
        )}
        {(amountHasData || campaign.showAmount) && !campaign.selfBooked && (
        <AmountCell
          value={campaign.amountNet2}
          visible={campaign.showAmount !== false}
          currency={campaign.currency}
          responsive
          responsiveTitle={t('serviceDashboard:AMOUNT')}
        />
        )}
        {(amountHasData || campaign.showAmount) && campaign.selfBooked && (
        <td />
        )}
      </tr>
    </tbody>
  );
};
// TODO type this file

Campaign.propTypes = {
  amountHasData: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default Campaign;
