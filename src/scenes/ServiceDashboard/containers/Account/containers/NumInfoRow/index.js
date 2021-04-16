import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAccount } from 'src/selectors';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as actions from './actions';
import * as selectors from './selectors';
import Numbers from './component';

const NumbersWrapper = ({ itemId }) => {
  const leadsCount = useSelector((state) => selectors.getCount(state, { instance: 'NEW' }));
  const leadsLoading = useSelector((state) => selectors.isLoading(state, { instance: 'NEW' }));
  const tasksCount = useSelector((state) => selectors.getCount(state, { instance: 'IN_PROGRESS' }));
  const tasksLoading = useSelector((state) => selectors.isLoading(state, { instance: 'IN_PROGRESS' }));
  const finishedTasksCount = useSelector((state) => selectors.getCount(state, { instance: 'DONE' }));
  const finishedTasksLoading = useSelector((state) => selectors.isLoading(state, { instance: 'DONE' }));
  const offeredCount = useSelector((state) => selectors.getCount(state, { instance: 'OFFERED' }));
  const offeredLoading = useSelector((state) => selectors.isLoading(state, { instance: 'OFFERED' }));
  const bookedCount = useSelector((state) => selectors.getCount(state, { instance: 'BOOKED' }));
  const bookedLoading = useSelector((state) => selectors.isLoading(state, { instance: 'BOOKED' }));
  const runningCount = useSelector((state) => selectors.getCount(state, { instance: 'RUNNING' }));
  const runningLoading = useSelector((state) => selectors.isLoading(state, { instance: 'RUNNING' }));
  const archivedCount = useSelector((state) => selectors.getCount(state, { instance: 'ARCHIVED' }));
  const archivedLoading = useSelector((state) => selectors.isLoading(state, { instance: 'ARCHIVED' }));
  const account = useSelector((state) => getAccount(state, { itemId }));
  const dispatch = useDispatch();
  useEffectWithToken(
    (token) => Promise.all([
      dispatch(actions.getFunnel(itemId, 'NEW', token)),
      dispatch(actions.getFunnel(itemId, 'IN_PROGRESS', token)),
      dispatch(actions.getFunnel(itemId, 'DONE', token, 'CONTACTED_CLIENT')),
      dispatch(actions.getSalesforce(itemId, 'OFFERED', token)),
      dispatch(actions.getSalesforce(itemId, 'BOOKED', token)),
      dispatch(actions.getSalesforce(itemId, 'RUNNING', token)),
      dispatch(actions.getSalesforce(itemId, 'ARCHIVED', token)),
    ]),
    [dispatch, itemId],
    true,
  );
  return (
    <Numbers
      leadsCount={leadsCount}
      leadsLoading={leadsLoading}
      tasksCount={tasksCount}
      tasksLoading={tasksLoading}
      finishedTasksCount={finishedTasksCount}
      finishedTasksLoading={finishedTasksLoading}
      offeredCount={offeredCount}
      offeredLoading={offeredLoading}
      bookedCount={bookedCount}
      bookedLoading={bookedLoading}
      runningCount={runningCount}
      runningLoading={runningLoading}
      archivedCount={archivedCount}
      archivedLoading={archivedLoading}
      account={account}
    />
  );
};

NumbersWrapper.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default NumbersWrapper;
