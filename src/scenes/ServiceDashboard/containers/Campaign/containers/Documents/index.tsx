import React from 'react';
import DocumentBox, { DocumentBoxProps } from 'src/components/document/DocumentBox';
import {
  CampaignDto, Document, EntityTypeInline, getDocuments as getDocumentsApi,
} from '@adnz/api-ws-salesforce';
import { useRequest } from '@adnz/use-request';
import DownloadDocumentButton from 'src/components/document/DownloadButton';
import DeleteDocumentButton from 'src/components/document/DeleteButton';
import UploadDocumentButton from 'src/scenes/ServiceDashboard/containers/Campaign/components/UploadDocumentButton';

interface DocumentsProps extends Omit<DocumentBoxProps, 'documents'> {
  campaign: CampaignDto,
}

const Documents:React.FC<DocumentsProps> = ({ campaign, toolbar, ...props }) => {
  const params = React.useMemo(
    () => ({
      entityId: campaign.campaignId,
      entityType: EntityTypeInline.CAMPAIGN,
      sort: 'createdAt',
      order: 'desc',
    }),
    [campaign.campaignId],
  );
  const [{ items: documents },, getDocuments] = useRequest({
    apiMethod: getDocumentsApi,
    defaultData: { items: [] as Document[] },
    parameters: [{
      entityId: campaign.campaignId, entityType: EntityTypeInline.CAMPAIGN, sort: 'createdAt', order: 'desc',
    }],
  });

  return (
    <DocumentBox
      documents={documents}
      uploadButton={() => (
        <UploadDocumentButton
          campaign={campaign}
          handleUpload={() => getDocuments(params)}
        />
      )}
      toolbar={(document) => (
        <>
          <DownloadDocumentButton
            document={document}
          />
          {
            campaign.hasPermission !== false
            && (
              <DeleteDocumentButton
                document={document}
                onSuccess={() => getDocuments(params)}
              />
            )
          }
        </>
      )}
      {...props}
    />
  );
};

export default Documents;
