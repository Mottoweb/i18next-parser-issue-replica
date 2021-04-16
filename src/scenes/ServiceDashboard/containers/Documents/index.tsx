import React from 'react';
import { useRequest } from '@adnz/use-request';
import { fromJS, Map } from 'immutable';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TableV1 from 'src/components/Table';
import { PageHeader } from '@adnz/ui';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import {
  Container,
} from 'styled-bootstrap-grid';
import Table from 'src/modules/Table';
import * as companySelectSelectors from 'src/scenes/ServiceDashboard/containers/CompanySelect/selectors';
import { getDocuments as getDocumentsApi } from '@adnz/api-ws-salesforce';
import DocumentRow from 'src/components/document/DocumentRow';
import DownloadDocumentButton from 'src/components/document/DownloadButton';
import CompanySelect from '../CompanySelect';

const Documents: React.FC = () => {
  const companyUuid = useSelector(companySelectSelectors.getActiveId);
  const [{ items, total },, getDocuments] = useRequest({
    apiMethod: getDocumentsApi,
    defaultData: { items: [], total: 0 },
    runOnMount: false,
  });
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const endpoint = React.useCallback(
    (args) => getDocuments({ ...args, ...args?.filters }),
    [getDocuments],
  );

  return (
    <>
      <PageHeader
        title={t('serviceDashboard:DOCUMENT_TITLE')}
      >
        <PrivateRoute
          roles={Roles.ADMIN}
          component={CompanySelect}
        />
      </PageHeader>
      <Container>
        <div className="table-container" id="table-container-all-documents">
          <Table
            component={TableV1}
            instance="documents"
            endpoint={endpoint}
            items={fromJS(items)}
            limit={20}
            total={total}
            query={{
              companyUuid,
            }}
            idField={(i:string) => i}
            fields={[
              {
                key: 'createdAt',
                name: t('serviceDashboard:DOCUMENT_CREATED'),
                sortable: false,
              },
              {
                key: 'icon',
                name: '',
              },
              {
                key: 'name',
                name: t('serviceDashboard:DOCUMENT_NAME'),
                sortable: false,
              },
              {
                key: 'actions',
                name: t('serviceDashboard:ACTIONS'),
                sortable: false,
              },
            ]}
            defaultOrderField="createdAt"
            defaultOrderDirection="desc"
            enablePager={false}
            rowRenderer={(item: Map<'id', string>) => (
              <DocumentRow
                key={item.get('id')}
                document={item.toJS()}
                toolbar={(document) => (
                  <DownloadDocumentButton
                    document={document}
                  />
                )}
              />
            )}
          />
        </div>
      </Container>
    </>
  );
};

export default Documents;
