import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import c from 'classnames';
import {
  Link,
} from 'react-router-dom';
import Responsive from 'react-responsive';
import { Tag } from '@adnz/ui';
import Colors from 'src/theme/Colors';
import { InvoiceDeliveryType } from '@adnz/api-ws-salesforce';
import { CampaignLabels } from 'src/components/AgencyCampaignNameCell';

const AgencyCampaignNameCell = ({
  internalOrderNumber,
  campaignName,
  campaignId,
  type,
  insightsIndicatorColor,
  insightsIndicatorMessage,
  urlPrefix,
  responsive,
  campaignLabel,
  campaign,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <td>
      <div className={c('cell-with-impressions', { 'mobile-cell': responsive })}>
        <Responsive maxWidth={991}>
          {!!responsive && (
            <p className="mobile-cell__label mobile-cell__label_first">
              {t('serviceDashboard:ORDER_NUMBER')}
            </p>
          )}
        </Responsive>
        <Link to={`/${urlPrefix}/campaigns/${type}/${campaignId}`}>
          {internalOrderNumber}
        </Link>
        <Tag.Group>
          <CampaignLabels campaign={campaign} campaignLabel={campaignLabel} />
          {['RUNNING', 'ARCHIVED'].includes(type) && insightsIndicatorColor === 'grey' && (
            <Tag value={t(insightsIndicatorMessage)} color={Colors['adnz-grey']} />
          )}
          {['RUNNING', 'ARCHIVED'].includes(type) && insightsIndicatorColor === 'green' && (
            <Tag value={t(insightsIndicatorMessage)} color={Colors['adnz-green']} />
          )}
        </Tag.Group>
      </div>
      <div>
        <Responsive maxWidth={991}>
          {!!responsive && (
            <p className="mobile-cell__label">
              {t('serviceDashboard:CAMPAIGN')}
            </p>
          )}
        </Responsive>
        <p className="cell-with-impressions__title">
          {campaignName}
        </p>
      </div>
    </td>
  );
};

AgencyCampaignNameCell.propTypes = {
  campaign: PropTypes.shape({
    isSelfBookedBusinessclick: PropTypes.bool,
    isCreditCardPayment: PropTypes.bool,
    invoiceDeliveryType: InvoiceDeliveryType,
  }).isRequired,
  insightsIndicatorColor: PropTypes.string,
  insightsIndicatorMessage: PropTypes.string,
  internalOrderNumber: PropTypes.string.isRequired,
  campaignName: PropTypes.string.isRequired,
  campaignLabel: PropTypes.string,
  campaignId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  urlPrefix: PropTypes.string,
  responsive: PropTypes.bool,
};

AgencyCampaignNameCell.defaultProps = {
  urlPrefix: 'buy-side',
  insightsIndicatorColor: undefined,
  insightsIndicatorMessage: undefined,
  campaignLabel: undefined,
  responsive: false,
};

export default AgencyCampaignNameCell;
