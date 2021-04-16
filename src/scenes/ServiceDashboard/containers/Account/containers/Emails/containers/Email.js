import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import { Button, Icons } from '@adnz/ui';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DateCell from 'src/components/DateCell';
import { fromDateTimeType } from '@adnz/api-helpers';
import * as selectors from '../../../selectors';
import * as actions from '../../../actions';

const Email = ({
  email,
  showEmail,
}) => (
  <tbody className="dash-tbody position" data-testid="task-details-email-table">
    <tr>
      <DateCell value={fromDateTimeType(email.get('date'))} />
      <td title={email.get('recipient_short') ? email.get('recipient') : ''}>
        {email.get('recipient_short', email.get('recipient'))}
      </td>
      <td>{email.get('sender')}</td>
      <td>{email.get('subject')}</td>
      <td>
        <Button
          data-testid="open-preview-modal-button"
          onClick={showEmail}
          icon
        >
          <Icons.ViewsFocus />
        </Button>
      </td>
    </tr>
  </tbody>
);

Email.propTypes = {
  email: ImmutablePropTypes.map.isRequired,
  showEmail: PropTypes.func.isRequired,
};

export default connect(
  (state, { itemId }) => ({
    email: selectors.getEmail(state, { itemId }),
  }),
  (dispatch, { itemId }) => ({
    showEmail: () => dispatch(actions.openEmailModal(itemId)),
  }),
)(Email);
