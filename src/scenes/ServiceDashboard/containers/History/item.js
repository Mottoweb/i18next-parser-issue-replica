import React from 'react';
import {
  connect,
} from 'react-redux';
import DateCell from 'src/components/DateCell';
import {
  DATE_TIME_SECONDS_FORMAT,
} from 'src/constants';
import { fromDateTimeType } from '@adnz/api-helpers';
import * as selectors from './selectors';
import PrintValue from './PrintValue';

const HistoryItem = ({
  activity,
}) => (
  <tbody className="dash-tbody">
    <tr>
      <DateCell value={fromDateTimeType(activity.get('creationDate'))} format={DATE_TIME_SECONDS_FORMAT} showLocal />
      <td>
        {activity.get('creatorName')}
      </td>
      <td>
        <PrintValue value={activity.get('keyValues').find((v) => v.get('key') === 'trigger').get('value')} />
      </td>
      <td>
        <PrintValue value={activity.get('keyValues').find((v) => v.get('key') === 'oldValue').get('value')} />
      </td>
      <td>
        <PrintValue
          value={activity.get('keyValues').find((v) => v.get('key') === 'newValue').get('value')}
          trigger={activity.get('keyValues').find((v) => v.get('key') === 'trigger').get('value')}
        />
      </td>
    </tr>
  </tbody>
);

export default connect(
  (state, { itemId }) => ({
    activity: selectors.getActivity(state, { itemId }),
  }),
)(HistoryItem);
