import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import {
  useHistory,
} from 'react-router-dom';
import SectionTitle from 'src/components/SectionTitle';
import { Button, TabButton } from '@adnz/ui';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import { useTranslation } from 'react-i18next';
import Table from 'src/modules/Table';
import Tooltip from 'src/components/Tooltip';
import Contact from './Contact';
import * as selectors from '../../selectors';
import * as actions from '../../actions';
import EmailModal from '../EmailForm/index';

const Contacts = ({
  taskId,
  accountId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getContacts(args)),
    [dispatch],
  );
  const setContactType = React.useCallback(
    (type) => dispatch(actions.setContactType(type)),
    [dispatch],
  );
  const ids = useSelector(selectors.getContactIds);
  const selectedType = useSelector(selectors.getActiveContactTypes);
  return (
    <Row>
      <Col md={12}>
        <EmailModal />
        <div css="display: flex;justify-content: space-between;align-items: center;">
          <SectionTitle>
            {t('serviceDashboard:CONTACTS')}
            <Tooltip css="font-size: 16px;" tooltip={t('serviceDashboard:TASK_CONTACT_DESCRIPTION')} />
          </SectionTitle>
          <TabButton.Group data-testid="task-tabs-list">
            <TabButton
              title={t('serviceDashboard:TASK_ACCOUNT')}
              onClick={() => setContactType('ACCOUNT')}
              active={selectedType === 'ACCOUNT'}
            />
            <TabButton
              title={t('serviceDashboard:AGENCY')}
              onClick={() => setContactType('AGENCY')}
              active={selectedType === 'AGENCY'}
            />
            <TabButton
              title={t('serviceDashboard:BROKER')}
              onClick={() => setContactType('BROKER')}
              active={selectedType === 'BROKER'}
            />
          </TabButton.Group>
        </div>
        <div css="display: flex;justify-content: flex-end;align-items: center;margin-bottom: 25px;">
          <PrivateRoute
            roles={Roles.MANAGE_ACCOUNTS}
            render={() => (
              <Button
                id="create-new-contact-button"
                onClick={() => history.push(`/buy-side/accounts/edit/${accountId}/contacts/create`)}
                target="_blank"
              >
                {t('serviceDashboard:CREATE_NEW_CONTACT')}
              </Button>
            )}
          />
        </div>
        <div id="contacts-table-task-details">
          <Table
            instance="users"
            endpoint={endpoint}
            items={ids}
            loading={false}
            idField={(id) => id}
            enablePager={false}
            query={{
              taskId,
            }}
            fields={[
              {
                key: 'switcher',
                name: '',
              },
              {
                key: 'name',
                name: t('serviceDashboard:NAME'),
              },
              {
                key: 'source',
                name: t('serviceDashboard:SOURCE'),
              },
              {
                key: 'function',
                name: t('serviceDashboard:FUNCTION'),
              },
              {
                key: 'email',
                name: t('serviceDashboard:EMAIL'),
              },
              {
                key: 'phoneNumber',
                name: t('serviceDashboard:PHONE_NUMBER'),
              },
              {
                key: 'buttons',
                name: '',
              },
            ]}
            defaultOrderField="userId"
            defaultOrderDirection="desc"
            rowRenderer={(id) => (
              <Contact key={id} taskId={taskId} contactId={id} />
            )}
          />
        </div>
      </Col>
    </Row>
  );
};

Contacts.propTypes = {
  taskId: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
};

export default Contacts;
