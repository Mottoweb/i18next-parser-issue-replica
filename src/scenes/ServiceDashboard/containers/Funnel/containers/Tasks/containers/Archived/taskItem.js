import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icons, Tag } from '@adnz/ui';
import { Link } from 'react-router-dom';
import Colors from 'src/theme/Colors';
import DateCell from 'src/components/DateCell';
import Responsive from 'react-responsive';
import { ICONS } from 'src/constants';
import { fromDateTimeType } from '@adnz/api-helpers';
import * as selectors from '../../selectors';
import * as actions from '../../actions';
import LastComment from '../LastComment';

const TaskItem = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const task = useSelector((state) => selectors.getTask(state, { itemId }));
  const account = useSelector((state) => selectors.getAccountByTaskId(state, { itemId }));
  const activity = useSelector((state) => selectors.getActivityByTaskId(state, { itemId }));
  const source = useSelector((state) => selectors.getSourceByTaskId(state, { itemId }));
  const isRestoringArchivedTask = useSelector(selectors.isRestoringArchivedTask);
  const tags = useSelector((state) => selectors.getTagsByTaskId(state, { itemId }));
  const creator = useSelector((state) => selectors.getCreatorByTaskId(state, { itemId }));
  const dispatch = useDispatch();
  const openRestoreArchivedModal = React.useCallback(
    () => dispatch(actions.openRestoreArchivedModal(itemId)),
    [dispatch, itemId],
  );
  return (
    <tbody className={`dash-tbody status-color_${task.get('activityStatusColor')}`} data-testid="archived-table-row">
      <tr>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:IMPORTANT')}
            </p>
          </Responsive>
          {!!task.get('isImportant') && <span data-testid="rocket-icon">{String.fromCodePoint(ICONS.ROCKET)}</span>}
        </td>
        <td>
          <div className="default-table__td">
            <div>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:PRIORITY')}
                </p>
              </Responsive>
              {t(task.get('priority'))}
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
              {t('serviceDashboard:ACCOUNT')}
            </p>
          </Responsive>
          <span>
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
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:LABELS')}
            </p>
          </Responsive>
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
              {t('serviceDashboard:CREATOR')}
            </p>
          </Responsive>
          {creator.get('name')}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:ACCOUNT_SALES')}
            </p>
          </Responsive>
          {task.get('accountSalesName')}
        </td>
        <td>
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
              {t('serviceDashboard:LAST_ACTIVITY')}
            </p>
          </Responsive>
          <LastComment activity={activity} activitiesCount={task.get('activitiesCount')} />
        </td>
        <td className="default-btn-group__td">
          <div className="default-btn-group">
            <span
              className={`default-btn-icon ${!!isRestoringArchivedTask && 'disabled'}`}
            >
              <Icons.Reload
                onClick={openRestoreArchivedModal}
                size={16}
              />
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

TaskItem.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default TaskItem;
