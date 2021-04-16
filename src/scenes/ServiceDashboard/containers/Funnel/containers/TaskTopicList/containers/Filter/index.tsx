import * as React from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Input, PageHeader } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import * as selectors from '../../selectors';
import * as actions from '../../actions';

const Filter: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const value = useSelector(selectors.getFilterValue);

  return (
    <PageHeader.Search dataTestId="task-topics-search">
      <Input
        onChange={(evt) => {
          dispatch(actions.setFilter(evt.target.value));
        }}
        type="text"
        value={value}
        placeholder={t('serviceDashboard:PLACEHOLDER_SEARCH')}
      />
    </PageHeader.Search>
  );
};

export default Filter;
