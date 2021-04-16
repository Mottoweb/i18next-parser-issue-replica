import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DateCell from 'src/components/DateCell';
import { useTranslation } from 'react-i18next';
import Responsive from 'react-responsive';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Icons } from '@adnz/ui';
import { fromDateTimeType } from '@adnz/api-helpers';
import * as selectors from '../../selectors';
import * as actions from '../../actions';

const Tag = ({
  tag,
  task,
  edit,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <tbody className="dash-tbody position">
      <tr>
        <td>{tag.get('name')}</td>
        <DateCell
          value={fromDateTimeType(tag.get('created'))}
          responsive
          responsiveTitle={t('serviceDashboard:CREATED')}
        />
        <DateCell
          value={fromDateTimeType(tag.get('lastAddedDate'))}
          responsive
          responsiveTitle={t('serviceDashboard:LAST_ADDED_LEAD')}
        />
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:TASK')}
            </p>
          </Responsive>
          {task && <Link to={`/workflows/salesFunnel/all/${task.get('id')}`}>{task.get('id')}</Link>}
        </td>
        <td>
          <ButtonGroup align="right">
            <Button
              id="edit-label-entry-button"
              onClick={edit}
              icon
            >
              <Icons.EditAlt size={28} />
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </tbody>
  );
};

Tag.propTypes = {
  tag: ImmutablePropTypes.map.isRequired,
  task: ImmutablePropTypes.map.isRequired,
  edit: PropTypes.func.isRequired,
};

export default connect(
  (state, { itemId }) => ({
    tag: selectors.getTag(state, { itemId }),
    task: selectors.getTagTask(state, { itemId }),
  }),
  (dispatch, { itemId }) => ({
    edit: () => dispatch(actions.openModal(itemId)),
  }),
)(Tag);
