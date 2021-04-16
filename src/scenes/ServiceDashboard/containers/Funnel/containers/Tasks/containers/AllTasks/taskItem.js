import React from 'react';
import PropTypes from 'prop-types';
import {
  useDispatch, useSelector,
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icons, Tag } from '@adnz/ui';
import {
  Link,
} from 'react-router-dom';
import Colors from 'src/theme/Colors';
import DateCell from 'src/components/DateCell';
import {
  push,
} from 'connected-react-router';
import Responsive from 'react-responsive';
import { ICONS } from 'src/constants';
import { fromDateTimeType } from '@adnz/api-helpers';
import * as selectors from '../../selectors';
import LastComment from '../LastComment';

const stopPropagation = (evt) => evt.stopPropagation();

const TaskItem = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const task = useSelector((state) => selectors.getTask(state, { itemId }));
  const campaign = useSelector((state) => selectors.getCampaignByTaskId(state, { itemId }));
  const assignee = useSelector((state) => selectors.getAssigneeByTaskId(state, { itemId }));
  const activity = useSelector((state) => selectors.getActivityByTaskId(state, { itemId }));
  const account = useSelector((state) => selectors.getAccountByTaskId(state, { itemId }));
  const source = useSelector((state) => selectors.getSourceByTaskId(state, { itemId }));
  const tags = useSelector((state) => selectors.getTagsByTaskId(state, { itemId }));
  const taskTopic = useSelector((state) => selectors.getTaskTopicByTaskId(state, { itemId }));
  const dispatch = useDispatch();
  const navigateToDetails = React.useCallback(
    () => dispatch(push(`/workflows/salesFunnel/all/${itemId}`)),
    [dispatch, itemId],
  );
  return (
    <tbody className="dash-tbody hover" data-testid="all-tasks-table-row">
      <tr onClick={navigateToDetails}>
        <td>
          <div className="default-table__td">
            <div>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:STATUS')}
                </p>
              </Responsive>
              {`${t(task.get('status'))} ${task.get('outcome') ? `(${t(task.get('outcome'))})` : ''}`}
            </div>
          </div>
        </td>
        <DateCell
          value={fromDateTimeType(task.get('created'))}
          responsive
          responsiveTitle={t('serviceDashboard:CREATED')}
        />
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:LEAD_SOURCE')}
            </p>
          </Responsive>
          {source.get('name')}
        </td>
        <td style={{ maxWidth: 250 }}>
          {tags.size !== 0 && (
            <Responsive maxWidth={991}>
              <p className="mobile-cell__label">
                {t('serviceDashboard:LABELS')}
              </p>
            </Responsive>
          )}
          {tags.map((tag) => (
            <Tag
              key={tag.get('id')}
              value={tag.get('name')}
              color={Colors['adnz-green']}
            />
          ))}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:ACCOUNT')}
            </p>
          </Responsive>
          <span onClick={stopPropagation}>
            <Link to={`/buy-side/accounts/${account.get('id')}`}>{account.get('displayName')}</Link>
          </span>
        </td>
        <td>
          {!!campaign.get('name')
            && (
              <>
                <Responsive maxWidth={991}>
                  <p className="mobile-cell__label">
                    {t('serviceDashboard:CAMPAIGN')}
                  </p>
                </Responsive>
                <span onClick={stopPropagation}>
                  <Link to={`/buy-side/campaigns/ALL/${campaign.get('campaignId')}`}>{campaign.get('name')}</Link>
                </span>
              </>
            )}
        </td>
        <td>
          {!!assignee.get('name') && (
            <Responsive maxWidth={991}>
              <p className="mobile-cell__label">
                {t('serviceDashboard:ASSIGNEE')}
              </p>
            </Responsive>
          )}
          {assignee.get('name')}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:IMPORTANT')}
            </p>
          </Responsive>
          {!!task.get('isImportant') && <span data-testid="rocket-icon">{String.fromCodePoint(ICONS.ROCKET)}</span>}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:PRIORITY')}
            </p>
          </Responsive>
          {t(task.get('priority'))}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:TASK_TOPIC')}
            </p>
          </Responsive>
          {t(taskTopic?.get('name'))}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:LAST_ACTIVITY')}
            </p>
          </Responsive>
          <LastComment activity={activity} activitiesCount={task.get('activitiesCount')} />
        </td>
        <Responsive maxWidth={991}>
          <td onClick={stopPropagation} className="default-btn-group__td">
            <div className="default-btn-group">
              <Icons.More size={18} onClick={navigateToDetails} />
            </div>
          </td>
        </Responsive>
      </tr>
    </tbody>
  );
};

TaskItem.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default TaskItem;
