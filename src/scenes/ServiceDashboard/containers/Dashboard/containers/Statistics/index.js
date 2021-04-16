import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as companySelectSelectors from 'src/scenes/ServiceDashboard/containers/CompanySelect/selectors';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import LoaderComponent from 'src/components/Loader';
import ErrorComponent from 'src/components/Error';
import Statistics from './component';
import * as actions from './actions';

const StatisticsLoader = () => {
  const companyUUID = useSelector(companySelectSelectors.getActiveId);
  const dispatch = useDispatch();
  const { loading, error } = useEffectWithToken(
    (token) => dispatch(actions.getStatistics(token, companyUUID)),
    [dispatch, companyUUID],
    true,
  );
  if (loading) {
    return <LoaderComponent />;
  }
  if (error) {
    return <ErrorComponent title={error.message} />;
  }
  return (
    <Statistics />
  );
};

export default StatisticsLoader;
