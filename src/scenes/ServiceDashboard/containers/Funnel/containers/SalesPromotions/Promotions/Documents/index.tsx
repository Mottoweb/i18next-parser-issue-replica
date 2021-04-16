import React from 'react';
import DocumentBox, { DocumentBoxProps } from 'src/components/document/DocumentBox';
import { Document, EntityTypeInline, getDocuments as getDocumentsApi } from '@adnz/api-ws-salesforce';
import { useRequest } from '@adnz/use-request';
import DownloadDocumentButton from 'src/components/document/DownloadButton';
import axios from 'axios';
import { getAuthHeaders } from 'src/api';
import Upload from 'src/components/Upload';
import DeleteDocumentButton from 'src/components/document/DeleteButton';

interface DocumentsProps extends Omit<DocumentBoxProps, 'documents'> {
  salesPromotionId: string,
}

const Documents:React.FC<DocumentsProps> = ({ salesPromotionId, toolbar, ...props }) => {
  const params = React.useMemo(() => ({
    entityId: salesPromotionId,
    entityType: EntityTypeInline.SALES_PROMOTION,
    sort: 'createdAt',
    order: 'desc',
  }), [salesPromotionId]);

  const [{ items: documents },, getDocuments] = useRequest({
    apiMethod: getDocumentsApi,
    defaultData: { items: [] as Document[] },
    parameters: [{
      entityId: salesPromotionId, entityType: EntityTypeInline.SALES_PROMOTION, sort: 'createdAt', order: 'desc',
    }],
  });

  return (
    <DocumentBox
      documents={documents}
      isAdmin
      uploadButton={() => (
        <Upload
          target={`${axios.defaults.baseURL}/api/ws-salesforce/documents/SALES_PROMOTION/${salesPromotionId}/ui`}
          headers={getAuthHeaders()}
          handleComplete={() => getDocuments(params)}
        />
      )}
      toolbar={(document) => (
        <>
          <DownloadDocumentButton
            document={document}
          />
          <DeleteDocumentButton
            document={document}
            onSuccess={() => getDocuments(params)}
          />
        </>
      )}
      {...props}
    />
  );
};

export default Documents;
