import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DateTime from 'src/components/DateTime';
import {
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  push,
} from 'connected-react-router';
import Colors from 'src/theme/Colors';
import Responsive from 'react-responsive';
import c from 'classnames';
import { ICONS } from 'src/constants';
import { Tooltip, Icons, Tag } from '@adnz/ui';
import { fromDateTimeType } from '@adnz/api-helpers';
import * as selectors from '../../selectors';
import LastComment from '../LastComment';

const stopPropagation = (evt) => evt.stopPropagation();

const TaskItem = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const navigateToDetails = React.useCallback(
    () => dispatch(push(`/workflows/salesFunnel/done/${itemId}`)),
    [dispatch, itemId],
  );
  const task = useSelector((state) => selectors.getTask(state, { itemId }));
  const statusClass = useSelector((state) => selectors.getFinishedTaskStatusClass(state, { itemId }));
  const assignAuthor = useSelector((state) => selectors.getAssignAuthorByTaskId(state, { itemId }));
  const tags = useSelector((state) => selectors.getTagsByTaskId(state, { itemId }));
  const activity = useSelector((state) => selectors.getActivityByTaskId(state, { itemId }));
  const assignee = useSelector((state) => selectors.getAssigneeByTaskId(state, { itemId }));
  const account = useSelector((state) => selectors.getAccountByTaskId(state, { itemId }));
  const source = useSelector((state) => selectors.getSourceByTaskId(state, { itemId }));
  return (
    <tbody className={c('dash-tbody hover', statusClass)} data-testid="done-table-row">
      <tr onClick={navigateToDetails}>
        <Responsive minWidth={992}>
          <td className="dash-td">
            <div className="default-table__td">
              <div>
                <span className={c('dash-td__span', statusClass)} />
              </div>
            </div>
          </td>
        </Responsive>
        <td className="dash-td">
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:OUTCOME')}
            </p>
          </Responsive>
          {t(task.get('outcome'))}
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
          {!!task.get('updated') && (
            <Responsive maxWidth={991}>
              <p className="mobile-cell__label">
                {t('serviceDashboard:FINISHED_TIME')}
              </p>
            </Responsive>
          )}
          <DateTime value={fromDateTimeType(task.get('updated'))} showLocal />
        </td>
        {!!task.get('assignedTime') && (
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:ASSIGNED_TIME')}
            </p>
          </Responsive>
        )}
        {!!assignAuthor && !!assignAuthor.get('name') ? (
          <Tooltip
            tooltip={assignAuthor.get('name')}
            containerComponent="td"
            placement="top"
          >
            <DateTime value={fromDateTimeType(task.get('assignedTime'))} showLocal />
          </Tooltip>
        )
          : (
            <td>
              <DateTime value={fromDateTimeType(task.get('assignedTime'))} showLocal />
            </td>
          )}
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
  itemId: PropTypes.string.isRequired,
};

export default TaskItem;
