import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as selectors from '../../selectors';

const TopicDiscussion = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const topicDiscussion = useSelector((state) => selectors.getTopicDiscussion(state, { itemId }));
  const topic = useSelector((state) => selectors.getTopicDiscussionTopic(state, { itemId }));
  return (
    <span>
      {`${topic.get('title')} - ${t(topicDiscussion.get('topicDiscussionResult'))}`}
    </span>
  );
};

TopicDiscussion.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default TopicDiscussion;
