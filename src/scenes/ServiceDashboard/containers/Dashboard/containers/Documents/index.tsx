import React from 'react';
import { useRequest } from '@adnz/use-request';
import { useSelector } from 'react-redux';
import DocumentBox from 'src/components/document/DocumentBox';
import * as companySelectSelectors from 'src/scenes/ServiceDashboard/containers/CompanySelect/selectors';
import { getDocuments as getDocumentsApi } from '@adnz/api-ws-salesforce';
import DownloadDocumentButton from 'src/components/document/DownloadButton';

const Documents:React.FC = () => {
  const companyUuid = useSelector(companySelectSelectors.getActiveId);
  const [{ items: documents }] = useRequest({
    apiMethod: getDocumentsApi,
    defaultData: { items: [] },
    parameters: [{
      limit: 5,
      order: 'desc',
      sort: 'createdAt',
      companyUuid,
    }],
  });
  return (
    <DocumentBox
      documents={documents}
      toolbar={(document) => (
        <DownloadDocumentButton document={document} />
      )}
      allDocumentsLink="/buy-side/dashboard/documents"
    />
  );
};

export default Documents;
