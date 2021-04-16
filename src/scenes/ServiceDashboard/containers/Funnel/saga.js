import {
  fork,
} from 'redux-saga/effects';
import sourceSaga from './containers/SourcesList/saga';
import tagSaga from './containers/TagsList/saga';
import taskSaga from './containers/Tasks/saga';
import activitySaga from './containers/Activities/saga';
import topicsSaga from './containers/MeetingTopicList/saga';
import taskTopicsSaga from './containers/TaskTopicList/saga';

function* rootSaga() {
  yield fork(sourceSaga);
  yield fork(topicsSaga);
  yield fork(taskTopicsSaga);
  yield fork(tagSaga);
  yield fork(taskSaga);
  yield fork(activitySaga);
}

export default rootSaga;
