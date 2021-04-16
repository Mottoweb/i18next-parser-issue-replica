import React from 'react';
import {
  connect,
} from 'react-redux';
import DateCell from 'src/components/DateCell';
import {
  DATE_TIME_SECONDS_FORMAT,
} from 'src/constants';
import {
  getActivity,
} from 'src/selectors';
import { fromDateTimeType } from '@adnz/api-helpers';

const HistoryItem = ({
  activity,
}) => (
  <tbody
    data-testid="history-table"
    className="dash-tbody"
  >
    <tr>
      <DateCell value={fromDateTimeType(activity.get('creationDate'))} format={DATE_TIME_SECONDS_FORMAT} />
      <td>
        {activity.get('creatorName')}
      </td>
      <td>
        {activity.get('keyValues').find((v) => v.get('key') === 'trigger').get('value')}
      </td>
      <td>
        {activity.get('keyValues').find((v) => v.get('key') === 'oldValue').get('value')}
      </td>
      <td>
        {activity.get('keyValues').find((v) => v.get('key') === 'newValue').get('value')}
      </td>
    </tr>
  </tbody>
);

export default connect(
  (state, { itemId }) => ({
    activity: getActivity(state, { itemId }),
  }),
)(HistoryItem);
