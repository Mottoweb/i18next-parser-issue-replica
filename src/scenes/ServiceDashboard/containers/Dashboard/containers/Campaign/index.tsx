import React from 'react';
import c from 'classnames';
import { useTranslation } from 'react-i18next';
import AgencyCampaignNameCell from 'src/components/AgencyCampaignNameCell';
import DateCell from 'src/components/DateCell';
import AmountCell from 'src/components/AmountCell';
import Responsive from 'react-responsive';
import CustomerCell from 'src/components/CustomerCell';
import useStatusClass from 'src/scenes/Campaigns/hooks/useStatusClass';
import useStatusMessage from 'src/scenes/Campaigns/hooks/useStatusMessage';
import useShortcutStatusClass from 'src/scenes/Campaigns/hooks/useShortcutStatusClass';
import { CampaignShort, fromDateTime } from '@adnz/api-ws-salesforce';
import { TooltipOver } from '@adnz/ui';

export interface ICampaign {
  type: string
  campaign: CampaignShort
  amountHasData: boolean
}

const Campaign: React.FC<ICampaign> = ({
  type,
  campaign,
  amountHasData,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const statusClass = useStatusClass(campaign);
  const tdStatusClass = useShortcutStatusClass(campaign);
  const statusMessage = useStatusMessage(campaign);

  return (
    <tbody className={c('dash-tbody', tdStatusClass)}>
      <tr>
        <Responsive minWidth={992}>
          {statusMessage ? (
            <TooltipOver
              message={statusMessage}
              containerComponent="td"
              css="overflow: hidden;"
            >
              <span className={statusClass} />
            </TooltipOver>
          ) : (
            <td css="overflow: hidden;">
              <span className={statusClass} />
            </td>
          )}
        </Responsive>
        <AgencyCampaignNameCell
          type={type}
          campaign={campaign}
          campaignName={campaign.campaignName}
          campaignId={campaign.campaignId}
          internalOrderNumber={campaign.internalOrderNumber}
          // insightsIndicatorColor={campaign.insightsIndicatorColor} todo: discover why this field here
          // insightsIndicatorMessage={campaign.insightsIndicatorMessage} todo: discover why this field here
          responsive
        />
        <CustomerCell
          responsive
          advertiserAccount={campaign.advertiserAccount}
        />
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:SALES_CONTACT')}
            </p>
          </Responsive>
          {campaign.owner}
        </td>
        <DateCell
          value={fromDateTime(campaign.startDate)}
          responsive
          responsiveTitle={t('serviceDashboard:START_DATE')}
        />
        <DateCell
          value={fromDateTime(campaign.endDate)}
          responsive
          responsiveTitle={t('serviceDashboard:END_DATE')}
        />
        {amountHasData ? (
          <AmountCell
            value={campaign.amountNet2}
            visible={campaign.showAmount !== false}
            currency={campaign.currency}
            responsive
            responsiveTitle={t('serviceDashboard:AMOUNT_NET2')}
          />
        ) : (
          <td css="width: 1%;" />
        )}
      </tr>
    </tbody>
  );
};

export default Campaign;
