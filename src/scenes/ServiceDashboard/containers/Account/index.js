import React, { useState, useCallback } from 'react';
import shortId from 'shortid';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {
  Container,
} from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Documents from 'src/scenes/AccountsWithN4/containers/Documents';
import { Tag, DropdownList, ButtonGroup } from '@adnz/ui';
import SectionTitle from 'src/components/SectionTitle';
import Divider from 'src/components/Divider';
import { PrivateRoute, Roles as AuthRoles } from '@adnz/use-auth';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import LoaderComponent from 'src/components/Loader';
import ErrorComponent from 'src/components/Error';
import Colors from 'src/theme/Colors';
import ActivityFormModal from 'src/modules/ActivityFormModal';
import { prepareData } from 'src/modules/ActivityFormModal/helpers';
import { createMeeting } from '@adnz/api-ws-funnel';
import { createActivity } from '@adnz/api-ws-activity';
import Emails from './containers/Emails';
import SalesPromotions from './containers/SalesPromotions';
import UpperMenu from '../../UpperMenu';
import * as accountSelectors from './selectors';
import * as actions from './actions';
import NumInfoRow from './containers/NumInfoRow';
import Details from './components/Details';
import Comment from './components/Comment';
import Contacts from './containers/Contacts';
import EditAccountButton from './components/EditAccountButton';
import History from './containers/History';
import Activities from './containers/Activities';
import CreateTaskModal from './containers/CreateTaskModal';
import DetailsRow from './components/DetailsRow';
import {
  ColumnContainer,
  Column,
  Title,
  Id,
  Roles,
} from './styles';

const Account = ({
  accountId,
}) => {
  const dispatch = useDispatch();
  const [opened, setOpened] = useState(false);
  const [accountActivitiesKey, setAccountActivitiesKey] = React.useState(shortId.generate());
  const openCreateTask = useCallback(
    () => dispatch(actions.openCreateTaskModal()),
    [dispatch],
  );
  const handleSubmit = useCallback(
    async (form) => {
      const data = prepareData(form);
      const isMeeting = data.activityType === 'MEETING';
      await (isMeeting ? createMeeting(data) : createActivity(data));
      setOpened(false);
      setAccountActivitiesKey(shortId.generate());
    },
    [],
  );
  const handleToggle = useCallback((value) => setOpened(value), [setOpened]);
  const account = useSelector(
    (state) => accountSelectors.getAccountDetails(state, { itemId: accountId }),
  );
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const isActive = account.get('active');
  return (
    <>
      <ActivityFormModal
        show={opened}
        handleClose={() => handleToggle(false)}
        handleSubmit={handleSubmit}
        predefinedAccountId={account.get('id')}
      />
      <UpperMenu />
      <div css="background:#fff;">
        <Container css="padding-top: 20px; padding-bottom: 20px;">
          <ColumnContainer>
            <Column>
              <Id>{`#${accountId}`}</Id>
              <div css="display: flex;align-items: center;">
                <Title>{account.get('name')}</Title>
                <Tag
                  color={isActive ? Colors['adnz-green'] : Colors.Scarlet}
                  value={isActive ? t('serviceDashboard:ACTIVE') : t('serviceDashboard:INACTIVE')}
                  css="margin-left: 15px;"
                />
              </div>
              <Roles css="margin-top: 6px">
                {account.get('roles').map((value) => (
                  <span key={value}>
                    {value}
                  </span>
                ))}
              </Roles>
            </Column>
            <ButtonGroup>
              <EditAccountButton itemId={accountId} />
              <DropdownList id="activities-actions">
                <PrivateRoute
                  roles={AuthRoles.SALESFUNNEL}
                  render={() => (
                    <DropdownList.Item
                      data-testid="create-activity-button"
                      disabled={!isActive}
                      onClick={() => handleToggle(true)}
                      children={t('serviceDashboard:CREATE_ACTIVITY')}
                    />
                  )}
                />
                <PrivateRoute
                  roles={AuthRoles.BOOK_CAMPAIGNS}
                  render={() => (
                    <DropdownList.Item
                      data-testid="create-new-offer-button"
                      disabled={!isActive}
                      onClick={() => history.push(`/buy-side/campaigns/OFFERED/new-order/${accountId}`)}
                      children={t('serviceDashboard:NEW_OFFER')}
                    />
                  )}
                />
                <PrivateRoute
                  roles={AuthRoles.SALESFUNNEL}
                  render={() => (
                    <DropdownList.Item
                      data-testid="create-lead-button"
                      disabled={!isActive}
                      onClick={openCreateTask}
                      children={t('serviceDashboard:CREATE_LEAD')}
                    />
                  )}
                />
              </DropdownList>
            </ButtonGroup>
          </ColumnContainer>
        </Container>
        <Divider />
        <Container>
          <NumInfoRow itemId={accountId} />
        </Container>
      </div>
      <CreateTaskModal
        accountId={accountId}
        account={account}
      />
      <Container className="forms-page">
        <SectionTitle>{t('serviceDashboard:DETAILS')}</SectionTitle>
        <DetailsRow account={account} css="margin-top:13px;" />
        <Details account={account} />
        <Comment itemId={accountId} />
        <Contacts itemId={accountId} />
        <Activities key={accountActivitiesKey} itemId={accountId} active={isActive} />
        <Documents key="OFFER" category="OFFER" title={t('serviceDashboard:OFFER_DOCUMENTS')} account={account.toJS()} />
        <Documents
          key="CONFIRMATION"
          category="CONFIRMATION"
          title={t('serviceDashboard:CONFIRMATION_DOCUMENTS')}
          account={account.toJS()}
        />
        <PrivateRoute
          roles={[AuthRoles.ADMIN_INVOICE]}
        >
          <Documents key="INVOICE" category="INVOICE" title={t('serviceDashboard:INVOICE_DOCUMENTS')} account={account.toJS()} />
        </PrivateRoute>
        <Documents key="CONTRACT" category="CONTRACT" title={t('serviceDashboard:CONTRACT_DOCUMENTS')} account={account.toJS()} />
        <Documents key="REPORT" category="REPORT" title={t('serviceDashboard:REPORT_DOCUMENTS')} account={account.toJS()} />
        <Documents key="OTHER" category="OTHER" title={t('serviceDashboard:OTHER_DOCUMENTS')} account={account.toJS()} />
        <PrivateRoute
          roles={[AuthRoles.SALESFUNNEL]}
        >
          <SalesPromotions accountId={accountId} />
        </PrivateRoute>
        <PrivateRoute
          roles={[AuthRoles.ADMIN]}
          render={() => (
            <Emails itemId={accountId} />
          )}
        />
        <History itemId={accountId} />
      </Container>
    </>
  );
};

Account.propTypes = {
  accountId: PropTypes.string.isRequired,
};

const AccountLoader = ({ accountId }) => {
  const dispatch = useDispatch();
  const { loading, error } = useEffectWithToken(
    (token) => dispatch(actions.getAccountDetails(token, accountId)),
    [dispatch, accountId],
    true,
  );
  if (loading) {
    return <LoaderComponent />;
  }
  if (error) {
    return <ErrorComponent title={error.message} />;
  }
  return <Account accountId={accountId} />;
};

AccountLoader.propTypes = {
  accountId: PropTypes.string.isRequired,
};

export default AccountLoader;
