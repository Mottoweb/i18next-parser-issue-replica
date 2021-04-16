import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icons, Tag } from '@adnz/ui';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DateCell from 'src/components/DateCell';
import {
  Link,
} from 'react-router-dom';
import {
  push,
} from 'connected-react-router';
import Colors from 'src/theme/Colors';
import { ICONS } from 'src/constants';
import { fromDateTimeType } from '@adnz/api-helpers';
import Responsive from 'react-responsive';
import c from 'classnames';
import * as selectors from '../../selectors';
import LastComment from '../LastComment';

const stopPropagation = (evt) => evt.stopPropagation();

const TaskItem = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const task = useSelector((state) => selectors.getTask(state, { itemId }));
  const assignee = useSelector((state) => selectors.getAssigneeByTaskId(state, { itemId }));
  const activity = useSelector((state) => selectors.getActivityByTaskId(state, { itemId }));
  const account = useSelector((state) => selectors.getAccountByTaskId(state, { itemId }));
  const source = useSelector((state) => selectors.getSourceByTaskId(state, { itemId }));
  const statusMessage = useSelector((state) => selectors.getTaskStatusMessage(state, { itemId }));
  const statusClass = useSelector((state) => selectors.getTaskStatusClass(state, { itemId }));
  const tags = useSelector((state) => selectors.getTagsByTaskId(state, { itemId }));
  const topicName = useSelector((state) => selectors.getTaskTopicName(state, { itemId }));
  const dispatch = useDispatch();
  const navigateToDetails = React.useCallback(
    () => dispatch(push(`/workflows/salesFunnel/snoozed/${itemId}`)),
    [dispatch, itemId],
  );
  return (
    <tbody className={c('dash-tbody hover', statusClass)} data-testid="snoozed-table-row">
      <tr onClick={navigateToDetails}>
        <Responsive minWidth={992}>
          <td className="dash-td">
            <Tooltip
              tooltip={t(statusMessage)}
              containerComponent="div"
              className="default-table__td"
            >
              <div>
                <span className={c('dash-td__span', statusClass)} />
              </div>
            </Tooltip>
          </td>
        </Responsive>
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
              {t('serviceDashboard:TOPIC')}
            </p>
          </Responsive>
          {topicName}
        </td>
        <DateCell
          value={fromDateTimeType(task.get('snoozedUntil'))}
          responsive
          responsiveTitle={t('serviceDashboard:SNOOZED_UNTIL')}
        />
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
              {t('serviceDashboard:ASSIGNEE')}
            </p>
          </Responsive>
          {assignee.get('name')}
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
  itemId: PropTypes.func.isRequired,
};

export default TaskItem;
