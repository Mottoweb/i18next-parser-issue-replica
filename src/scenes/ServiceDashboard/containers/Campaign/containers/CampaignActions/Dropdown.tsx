import React, { useContext, useState } from 'react';
import { useRequest } from '@adnz/use-request';
import {
  CampaignDto, CampaignStage, getDocumentFileByReference,
  downloadDailyDeliveryReport as downloadDailyDeliveryReportApi,
  createPdfAttachmentDocument,
} from '@adnz/api-ws-salesforce';
import {
  generateTemporaryCampaignReportByCampaignId, downloadTemporaryCampaignReportByCampaignId,
} from '@adnz/api-ws-campaign-reports';
import { useHistory } from 'react-router-dom';
import { DropdownList } from '@adnz/ui';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import { useTranslation } from 'react-i18next';
import base64toArrayBuffer from 'base64-arraybuffer';
import fileSaver from 'file-saver';
import { CAMPAIGN_STAGES } from 'src/constants';
import { CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import CloneButton
  from 'src/scenes/ServiceDashboard/containers/Campaign/containers/CampaignActions/components/CloneButton';
import CreateInvoiceListItem
  from 'src/scenes/ServiceDashboard/containers/Campaign/containers/CampaignActions/components/CreateInvoiceListItem';

interface DropdownButtonProps {
  campaign: CampaignDto,
  entityId?: string,
  checkDeliveredItems: boolean,
}

const DropdownButton:React.FC<DropdownButtonProps> = ({
  campaign: {
    campaignId,
    stage,
    isSelfBookedBusinessclick,
  },
  entityId,
  checkDeliveredItems,
}) => {
  const { t, i18n } = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const [isDownloadingOrder, setDownloadingOrder] = useState<boolean>(false);
  const { state: { campaign } } = useContext(CampaignToolContext);

  const [, { pending: isDownloadingDailyCampaignReport }, downloadDailyDeliveryReport] = useRequest({
    apiMethod: downloadDailyDeliveryReportApi,
    runOnMount: false,
    onSuccess: React.useCallback(
      (data) => {
        const blob = new window.Blob([base64toArrayBuffer.decode(data.content)]);
        fileSaver.saveAs(blob, data.name);
      },
      [],
    ),
  });

  const [, { pending: isDownloadingCampaignReport }, downloadCampaignReport] = useRequest({
    apiMethod: downloadTemporaryCampaignReportByCampaignId,
    runOnMount: false,
    onSuccess: React.useCallback(
      (data) => {
        const blob = new window.Blob([base64toArrayBuffer.decode(data.content)]);
        fileSaver.saveAs(blob, data.name);
      },
      [],
    ),
  });

  const [, { pending: isGeneratingCampaignReport }, generateCampaignReport] = useRequest({
    apiMethod: generateTemporaryCampaignReportByCampaignId,
    runOnMount: false,
    onSuccess: React.useCallback(
      () => {
        downloadCampaignReport({ campaignId });
      },
      [downloadCampaignReport, campaignId],
    ),
  });

  const [,, downloadOrderDocument] = useRequest({
    apiMethod: getDocumentFileByReference,
    runOnMount: false,
    onSuccess: (data, params) => {
      try {
        const blob = new window.Blob([base64toArrayBuffer.decode(data.content)]);
        setDownloadingOrder(false);
        fileSaver.saveAs(blob, data.name);
      } catch (e) {
        setTimeout(() => downloadOrderDocument(...params), 300);
      }
    },
  });

  const [,, createAttachmentAndDownload] = useRequest({
    apiMethod: createPdfAttachmentDocument,
    runOnMount: false,
    onSuccess: React.useCallback(
      (reference) => {
        setDownloadingOrder(true);
        downloadOrderDocument({ reference });
      },
      [setDownloadingOrder, downloadOrderDocument],
    ),
  });

  const checkCampaignStage = React.useMemo<boolean>(
    () => [
      CampaignStage.BOOKED,
      CampaignStage.PREPAYMENT,
      CampaignStage.PERFORMANCE,
    ].some((i) => i === stage),
    [stage],
  );

  return (
    <DropdownList dataTestId="dropdown-container-button">
      {
       !campaign?.isSelfBookedBusinessclick && checkCampaignStage && !!entityId && campaign?.hasPermission
        && (
          <CreateInvoiceListItem campaignId={campaignId} />
        )
      }
      {
        checkDeliveredItems
        && (
          <DropdownList.Item
            id="download-campaign-report-dropdown-item"
            isLoading={isDownloadingCampaignReport || isGeneratingCampaignReport}
            onClick={() => generateCampaignReport({ campaignId })}
          >
            {t('serviceDashboard:DOWNLOAD_CAMPAIGN_REPORT')}
          </DropdownList.Item>
        )
      }
      {
        checkDeliveredItems
        && (
          <DropdownList.Item
            id="download-daily-delivery-dropdown-item"
            isLoading={isDownloadingDailyCampaignReport}
            onClick={() => downloadDailyDeliveryReport({ campaignId })}
          >
            {t('serviceDashboard:DOWNLOAD_CAMPAIGN_DAILY_DELIVERY')}
          </DropdownList.Item>
        )
      }
      {
        checkDeliveredItems && campaign?.hasPermission
        && (
        <DropdownList.Item
          id="send-campaign-report-dropdown-item"
          onClick={() => history.push(`/workflows/operations/digital/reports/campaigns/${campaignId}`)}
        >
          {t('serviceDashboard:SEND_CAMPAIGN_REPORT')}
        </DropdownList.Item>
        )
      }
      {
        isSelfBookedBusinessclick
        && campaign?.stage === CAMPAIGN_STAGES.BOOKED && (
        <DropdownList.Item
          isLoading={isDownloadingOrder}
          onClick={() => createAttachmentAndDownload({ campaignId, language: i18n.language })}
        >
          {t('serviceDashboard:DOWNLOAD_ORDER')}
        </DropdownList.Item>
        )
      }
      {campaign && campaign?.hasPermission && (
        <PrivateRoute
          roles={[Roles.BOOK_CAMPAIGNS, Roles.SELF_BOOKING]}
          render={() => (
            <CloneButton campaign={campaign} />
          )}
        />
      )}
    </DropdownList>
  );
};

export default DropdownButton;
