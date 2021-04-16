import {
  combineReducers,
} from 'redux-immutable';

import Tasks from './containers/Tasks/reducer';
import Activities from './containers/Activities/reducer';
import Tags from './containers/TagsList/reducer';
import Sources from './containers/SourcesList/reducer';
import Topics from './containers/MeetingTopicList/reducer';
import TaskTopicsList from './containers/TaskTopicList/reducer';
import SourcesSelect from './containers/SourcesSelect/reducer';
import LabelSelect from './containers/LabelSelect/reducer';
import SalesSelect from './containers/SalesSelect/reducer';
import UserSelect from './containers/UserSelect/reducer';
import ContactSelect from './containers/ContactSelect/reducer';
import CreatorSelect from './containers/CommentCreatorSelect/reducer';
import OutcomeSelect from './containers/OutcomeSelect/reducer';
import TimeframeSelect from './containers/TimeframeSelect/reducer';
import TopicSelect from './containers/TopicSelect/reducer';
import Meetings from './containers/Meetings/reducer';

export default combineReducers({
  Tasks,
  Activities,
  Tags,
  Sources,
  SourcesSelect,
  SalesSelect,
  UserSelect,
  CreatorSelect,
  LabelSelect,
  OutcomeSelect,
  TimeframeSelect,
  Meetings,
  TopicSelect,
  TaskTopicsList,
  Topics,
  ContactSelect,
});
