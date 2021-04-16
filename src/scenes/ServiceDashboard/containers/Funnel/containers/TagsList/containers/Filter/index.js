import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, PageHeader } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import * as selectors from '../../selectors';
import * as actions from '../../actions';

const Filter = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const value = useSelector(selectors.getFilterValue);
  const dispatch = useDispatch();
  const setFilter = React.useCallback(
    (v) => dispatch(actions.setFilter(v)),
    [dispatch],
  );
  return (
    <PageHeader.Search dataTestId="salesFunnel-labels-search">
      <Input
        onChange={(evt) => {
          setFilter(evt.target.value);
        }}
        type="text"
        value={value}
        placeholder={t('serviceDashboard:PLACEHOLDER_SEARCH')}
      />
    </PageHeader.Search>
  );
};

export default Filter;
