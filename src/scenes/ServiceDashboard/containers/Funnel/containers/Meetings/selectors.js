import {
  createSelector,
} from 'reselect';
import createCachedSelector from 're-reselect';
import {
  Map,
  List,
  OrderedSet,
} from 'immutable';
import {
  getRefs,
  getItemId,
} from 'src/selectors';
import {
  getMeetingsRoot as getRoot,
} from '../../selectors';

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new OrderedSet()).toList(),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total', 0),
);

export const getMeetings = createSelector(
  getRefs,
  getIds,
  (state, ids) => ids.map((id) => state.getIn(['MeetingShort', id], new Map())),
);

export const getMeeting = createCachedSelector(
  getRefs,
  getItemId,
  (state, itemId) => state.getIn(['MeetingShort', itemId], new Map()),
)(getItemId);

export const getTopicDiscussion = createCachedSelector(
  getRefs,
  getItemId,
  (state, id) => state.getIn(['TopicDiscussion', id], new Map()),
)(getItemId);

export const getMeetingTopicDiscussionIds = createCachedSelector(
  getMeeting,
  (meeting) => meeting.get('topicDiscussions', new List()),
)(getItemId);

export const getMeetingContact = createSelector(
  getRefs,
  getMeeting,
  (state, meeting) => (meeting.get('contact') ? state.getIn(['ContactShort', meeting.get('contact')]) : null),
);

export const getMeetingTask = createSelector(
  getRefs,
  getMeeting,
  (state, meeting) => (meeting.get('task') ? state.getIn(['TaskDto', meeting.get('task')]) : null),
);

export const getTopicDiscussionTopic = createSelector(
  getRefs,
  getTopicDiscussion,
  (state, discussion) => state.getIn(['TopicDto', discussion.get('topic')]),
);
