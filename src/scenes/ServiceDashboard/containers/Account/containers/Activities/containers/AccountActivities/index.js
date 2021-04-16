import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Table from 'src/modules/Table';
import Activity from './containers/activity';
import * as selectors from '../../../../selectors';
import * as actions from '../../../../actions';

const AccountActivities = ({
  account,
}) => {
  const items = useSelector(selectors.getActivityIds);
  const isLoading = useSelector(selectors.isActivitiesLoading);
  const dispatch = useDispatch();
  const endpoint = React.useCallback(
    (args) => dispatch(actions.getActivities(args)),
    [dispatch],
  );
  return (
    <Table
      instance="account-activities"
      endpoint={endpoint}
      query={{
        accountId: account.get('id'),
      }}
      loading={isLoading}
      limit={5}
      items={items}
      enablePager={false}
      idField={(id) => id}
      withoutHeader
      fields={[
        {
          key: 'creationDate',
          name: '',
        },
      ]}
      defaultOrderField="creationDate"
      defaultOrderDirection="desc"
      rowRenderer={(id) => (
        <Activity key={id} activityId={id} />
      )}
    />
  );
};

AccountActivities.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
};

export default AccountActivities;
