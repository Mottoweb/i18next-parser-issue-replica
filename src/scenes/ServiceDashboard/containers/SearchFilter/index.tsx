import React from 'react';
import { push } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Input } from '@adnz/ui';
import * as selectors from './selectors';
import * as actions from './actions';
import { Clear } from './styles';

export interface ISearchFilter {
  id?: string,
  type: string
  noRedirect?: boolean
  placeholder?: string
}

const SearchFilter: React.FC<ISearchFilter> = ({
  id = 'campaigns-search',
  type,
  noRedirect = false,
  placeholder,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  // @ts-expect-error Expected 1 arguments, but got 2.ts(2554)
  const value = useSelector((state) => selectors.getValue(state, { type }));
  const dispatch = useDispatch();

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => dispatch(actions.setValue(event.target.value, type)),
    [type, dispatch],
  );

  const handleSearchEntered = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (noRedirect !== true) {
          dispatch(push(`/buy-side/${type}/ALL`));
        }

        // @ts-expect-error Property 'value' does not exist on type 'EventTarget'.ts(2339)
        dispatch(actions.setAppliedValue(event.target.value, type));
      }
    },
    [type, noRedirect, dispatch],
  );

  const handleReset = React.useCallback(
    () => {
      dispatch(actions.setValue('', type));
      dispatch(actions.setAppliedValue('', type));
    },
    [type, dispatch],
  );

  return (
    <div>
      <Input
        css="padding-right: 38px;"
        id={id}
        placeholder={placeholder ?? t('serviceDashboard:SEARCH_FOR_CAMPAIGNS')}
        type="text"
        value={value}
        autoComplete="none"
        onChange={handleChange}
        onKeyDown={handleSearchEntered}
      />
      {!!value && (
        <Clear onClick={handleReset} size={10} />
      )}
    </div>
  );
};

export default SearchFilter;
