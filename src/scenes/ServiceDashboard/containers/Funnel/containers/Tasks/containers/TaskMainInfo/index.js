import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  DropdownList,
  PageHeader,
  Tag,
  Link,
  Section,
  InnerGroup,
} from '@adnz/ui';
import {
  Container,
  Row,
  Col,
} from 'styled-bootstrap-grid';
import Colors from 'src/theme/Colors';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  push,
} from 'connected-react-router';
import { DATE_FORMAT, DATE_TIME_FORMAT, ICONS } from 'src/constants';
import { fromDateTime } from '@adnz/api-ws-funnel';
import { useHistory } from 'react-router-dom';

import { useIdentityRoles } from '@adnz/use-auth';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import FinishingModal from './containers/FinishingModal';
import RestoreModal from './containers/RestoreModal';
import SnoozingModal from './containers/SnoozingModal';
import SourceDescriptionModal from './containers/SourceDescriptionModal';

const TaskMainInfo = ({
  itemId,
  taskType,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  const { MANAGE_ACCOUNTS } = useIdentityRoles();
  const task = useSelector((state) => selectors.getTask(state, { itemId }));
  const campaign = useSelector((state) => selectors.getCampaignByTaskId(state, { itemId }));
  const creator = useSelector((state) => selectors.getCreatorByTaskId(state, { itemId }));
  const account = useSelector((state) => selectors.getAccountByTaskId(state, { itemId }));
  const agencyAccount = useSelector((state) => selectors.getAgencyAccountByTaskIdLabelValue(state, { itemId }));
  const brokerAccount = useSelector((state) => selectors.getBrokerAccountByTaskIdLabelValue(state, { itemId }));
  const source = useSelector((state) => selectors.getSourceByTaskId(state, { itemId }));
  const taskTopic = useSelector((state) => selectors.getTaskTopicByTaskId(state, { itemId }));
  const assignee = useSelector((state) => selectors.getAssigneeByTaskId(state, { itemId }));
  const tags = useSelector((state) => selectors.getTagsByTaskId(state, { itemId }));
  const dispatch = useDispatch();
  const openFinishModal = React.useCallback(
    () => dispatch(actions.openFinishModal(itemId)),
    [dispatch, itemId],
  );
  const openRestoreModal = React.useCallback(
    () => dispatch(actions.openRestoreModal(itemId)),
    [dispatch, itemId],
  );
  const openSnoozeModal = React.useCallback(
    () => dispatch(actions.openSnoozeModal(itemId)),
    [dispatch, itemId],
  );
  const openSourceModal = React.useCallback(
    (sourceId) => dispatch(actions.openSourceModal(sourceId)),
    [dispatch],
  );
  const openEditForm = React.useCallback(
    () => dispatch(actions.showTaskEditForm()),
    [dispatch],
  );
  const redirectToNewOffer = React.useCallback(
    () => dispatch(push(`/buy-side/campaigns/OFFERED/tasks/${itemId}/new-order/`)),
    [dispatch, itemId],
  );
  return (
    <>
      <FinishingModal itemId={task.get('id')} />
      <SnoozingModal />
      <RestoreModal />
      <SourceDescriptionModal />
      <PageHeader
        onBackClick={() => history.push(`/workflows/salesFunnel/tasks/${taskType}`)}
        title={t('serviceDashboard:TASK_DETAILS')}
        actions={(
          <ButtonGroup id="button-group">
            {task.get('status') !== 'DONE' && (
              <Button
                id="edit-task-details-button"
                theme="edit"
                onClick={() => openEditForm()}
              >
                <span>{t('serviceDashboard:EDIT_TASK_DETAILS')}</span>
              </Button>
            )}
            {!!task.get('assignee') && (
              <DropdownList id="task-details-actions">
                {
                  !!task.get('assignee')
                  && task.get('status') !== 'DONE'
                  && task.get('status') !== 'SNOOZED'
                  && task.get('status') !== 'ARCHIVED'
                  && (
                    <DropdownList.Item
                      data-testid="new-offer-button"
                      onClick={redirectToNewOffer}
                      children={t('serviceDashboard:NEW_OFFER')}
                    />
                  )
                }
                {!!task.get('assignee') && task.get('status') !== 'DONE' && task.get('status') !== 'ARCHIVED' && (
                  <DropdownList.Item
                    data-testid="snooze-task-button"
                    onClick={openSnoozeModal}
                    children={task.get('status') !== 'SNOOZED' ? t('serviceDashboard:SNOOZE_TASK') : t('serviceDashboard:UNSNOOZE_TASK')}
                  />
                )}
                {!!task.get('assignee') && task.get('status') !== 'DONE' && task.get('status') !== 'ARCHIVED' && (
                  <DropdownList.Item
                    data-testid="finish-task-button"
                    onClick={openFinishModal}
                    children={t('serviceDashboard:FINISH_TASK_BUTTON')}
                  />
                )}
                {task.get('status') === 'DONE' && (
                  <DropdownList.Item
                    onClick={openRestoreModal}
                    children={t('serviceDashboard:RESTORE_TASK')}
                  />
                )}
              </DropdownList>
            )}
          </ButtonGroup>
        )}
      />
      <Container>
        <div>
          <Section>
            <Row>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:LEAD_SOURCE')}
                  </p>
                  <div>
                    <Link
                      theme="orange"
                      as="span"
                      onClick={() => openSourceModal(source.get('id'))}
                    >
                      {source.get('name')}
                    </Link>
                  </div>
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:PRIORITY')}
                  </p>
                  <div>
                    {t(task.get('priority'))}
                    {!!task.get('isImportant') && (
                    <span css="margin-left: 10px;">{String.fromCodePoint(ICONS.ROCKET)}</span>
                    )}
                  </div>
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:LABELS')}
                  </p>
                  {!!task.get('tags').size
                  && (
                  <Tag.Group>
                    {tags.map((tag) => (
                      <Tag
                        key={tag.get('id')}
                        value={tag.get('name')}
                        color={Colors['adnz-green']}
                      />
                    ))}
                  </Tag.Group>
                  )}
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:CREATED')}
                  </p>
                  <div>{fromDateTime(task.get('created')).local().format(DATE_TIME_FORMAT)}</div>
                </InnerGroup>
              </Col>
            </Row>
          </Section>
          <Section>
            <Row>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:SNOOZED_UNTIL')}
                  </p>
                  {!!task.get('snoozedUntil')
                && <div>{fromDateTime(task.get('snoozedUntil'))?.format(DATE_FORMAT)}</div>}
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:ACCOUNT')}
                  </p>
                  <div>
                    {!!MANAGE_ACCOUNTS && (
                    <Link
                      theme="orange"
                      to={`/buy-side/accounts/${account.get('id')}`}
                    >
                      {account.get('displayName')}
                    </Link>
                    )}
                    {!MANAGE_ACCOUNTS && (
                      account.get('displayName')
                    )}
                  </div>
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:DIRECT_ACCOUNT_NUMBER')}
                  </p>
                  {!!account.get('phone') && (
                    <Link as="a" href={`tel:${account.get('phoneNoFormatting')}`}>{account.get('phone')}</Link>
                  )}
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:ACCOUNT_SALES')}
                  </p>
                  {!!task.get('accountSalesName')
                && <div>{task.get('accountSalesName')}</div>}
                </InnerGroup>
              </Col>
            </Row>
          </Section>
          <Section>
            <Row>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:DEFAULT_AGENCY_ACCOUNT')}
                  </p>
                  {task.get('agencyAccount') && (
                  <div>
                    {!!MANAGE_ACCOUNTS && (
                      <Link
                        theme="orange"
                        to={`/buy-side/accounts/${agencyAccount.value}`}
                      >
                        {agencyAccount.label}
                      </Link>
                    )}
                    {!MANAGE_ACCOUNTS && (
                      agencyAccount.label
                    )}
                  </div>
                  )}
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:DEFAULT_BROKER_ACCOUNT')}
                  </p>
                  {task.get('brokerAccount') && brokerAccount && (
                  <div>
                    {!!MANAGE_ACCOUNTS && (
                      <Link
                        theme="orange"
                        to={`/buy-side/accounts/${brokerAccount.value}`}
                      >
                        {brokerAccount.label}
                      </Link>
                    )}
                    {!MANAGE_ACCOUNTS && (
                      brokerAccount.label
                    )}
                  </div>
                  )}
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:ASSIGNEE')}
                  </p>
                  {!!task.get('assignee')
                && <div>{assignee.get('name')}</div>}
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:CREATOR')}
                  </p>
                  <div>{creator.get('name')}</div>
                </InnerGroup>
              </Col>
            </Row>
          </Section>
          <Section>
            <Row>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:STATUS')}
                  </p>
                  <div>{t(task.get('status'))}</div>
                </InnerGroup>
              </Col>
              {!!taskTopic && (
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:TASK_TOPIC')}
                  </p>
                  <div>{t(taskTopic.get('name'))}</div>
                </InnerGroup>
              </Col>
              )}
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:OUTCOME')}
                  </p>
                  {!!task.get('outcome')
                && <div>{t(task.get('outcome'))}</div>}
                </InnerGroup>
              </Col>
              <Col md={3}>
                <InnerGroup>
                  <p>
                    {t('serviceDashboard:CAMPAIGN')}
                  </p>
                  {!!task.get('campaign')
                && (
                <div>
                  <Link
                    theme="orange"
                    to={`/buy-side/campaigns/ALL/${campaign.get('campaignId')}`}
                  >
                    {`${campaign.get('name')}`}
                  </Link>
                </div>
                )}
                </InnerGroup>
              </Col>
            </Row>
          </Section>
        </div>
      </Container>
    </>
  );
};

TaskMainInfo.propTypes = {
  itemId: PropTypes.string.isRequired,
  taskType: PropTypes.string.isRequired,
};

export default TaskMainInfo;
