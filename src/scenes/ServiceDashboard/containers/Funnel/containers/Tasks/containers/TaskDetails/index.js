import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'styled-bootstrap-grid';
import { useSelector, useDispatch } from 'react-redux';
import EmailsList from 'src/scenes/ServiceDashboard/containers/Account/containers/Emails';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import LoaderComponent from 'src/components/Loader';
import ErrorComponent from 'src/components/Error';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import TaskMainInfo from '../TaskMainInfo';
import Form from '../EditForm';
import Activities from '../Activities';
import Contacts from '../Contacts';
import * as actions from '../../actions';
import * as selectors from '../../selectors';

const TaskDetails = ({
  taskId,
  taskType,
}) => {
  const showTaskEditForm = useSelector(selectors.showTaskEditForm);
  const task = useSelector((state) => selectors.getTask(state, { itemId: taskId }));
  const taskContactEmails = useSelector((state) => selectors.getTaskContactEmailsByTaskId(state, { itemId: taskId }));
  const account = useSelector((state) => selectors.getAccountByTaskId(state, { itemId: taskId }));
  const dispatch = useDispatch();
  const openEditForm = React.useCallback(
    () => dispatch(actions.showTaskEditForm()),
    [dispatch],
  );
  const { loading, error } = useEffectWithToken(
    (token) => Promise.all([
      dispatch(actions.getTask(token, taskId)),
      dispatch(actions.hideTaskEditForm()),
      dispatch(actions.getEmailSyncInfo()),
    ]),
    [taskId],
    true,
  );
  if (loading) {
    return <LoaderComponent />;
  }
  if (error) {
    return <ErrorComponent title={error.message} />;
  }

  return (
    <>
      {showTaskEditForm ? (
        <Form
          taskId={task.get('id')}
          isEdit
        />
      ) : (
        <TaskMainInfo
          itemId={task.get('id')}
          edit={openEditForm}
          taskType={taskType}
        />
      )}
      <Container>
        <Contacts
          accountId={account.get('id')}
          taskId={task.get('id')}
        />
        <Activities
          taskId={task.get('id')}
          accountId={account.get('id')}
        />
        <PrivateRoute
          roles={Roles.ADMIN}
          render={() => (
            <EmailsList
              itemId={account.get('id')}
              emailFilter={taskContactEmails}
              limit={10}
              sortable
            />
          )}
        />
      </Container>
    </>
  );
};

TaskDetails.propTypes = {
  taskId: PropTypes.string.isRequired,
  taskType: PropTypes.string.isRequired,
};

export default TaskDetails;
