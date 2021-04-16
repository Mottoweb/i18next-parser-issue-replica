import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  Map,
  List,
} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DateTime from 'src/components/DateTime';
import {
  Link,
} from 'react-router-dom';
import { fromDateTimeType } from '@adnz/api-helpers';
import TopicDiscussion from '../TopicDiscussion';
import * as selectors from '../../selectors';

const Meeting = ({
  meeting,
  topicDiscussionIds,
}) => (
  <tbody className="dash-tbody">
    <tr>
      <td>{meeting.get('title')}</td>
      <td><DateTime value={fromDateTimeType(meeting.get('date'))} showLocal /></td>
      <td>{meeting.get('contactName')}</td>
      <td>
        {meeting.get('taskId') && (
          <span>
            <Link to={`/workflows/salesFunnel/all/${meeting.get('taskId')}`}>
              {meeting.get('taskId')}
            </Link>
          </span>
        )}
      </td>
      <td style={{ maxWidth: 250 }}>
        {topicDiscussionIds.map((id) => (
          <TopicDiscussion key={id} itemId={id} />
        ))}
      </td>
    </tr>
  </tbody>
);

Meeting.propTypes = {
  meeting: ImmutablePropTypes.map,
  topicDiscussionIds: ImmutablePropTypes.list,
};

Meeting.defaultProps = {
  meeting: Map(),
  topicDiscussionIds: List(),
};

export default connect(
  (state, { itemId }) => ({
    meeting: selectors.getMeeting(state, { itemId }),
    topicDiscussionIds: selectors.getMeetingTopicDiscussionIds(state, { itemId }),
  }),
)(Meeting);
