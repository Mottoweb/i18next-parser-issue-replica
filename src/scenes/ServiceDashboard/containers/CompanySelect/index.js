import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactSelectV2Field from 'src/components/ReactSelectV2Field';
import { getCompanies } from '@adnz/api-ws-companies';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as selectors from './selectors';
import * as actions from './actions';

const CompanySelect = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const value = useSelector(selectors.getActiveValue);
  const dispatch = useDispatch();
  const onChange = React.useCallback(
    (newValue) => dispatch(actions.select(newValue)),
    [dispatch],
  );
  const { execute: loadOptions } = useEffectWithToken(
    async (token, filter = '') => {
      const response = await getCompanies({ filter }, token);
      const options = response.data.items.map((website) => ({
        value: website,
        label: website.name,
      }));
      if (!value && options.length > 0) {
        const option = options.find((v) => v.label === 'NZZ Österreich GmbH') || options[0];
        onChange(option);
      }
      return options;
    },
    [dispatch, value],
  );
  return (
    <div className="flex-page__page-select">
      <ReactSelectV2Field
        input={{
          name: 'company-select',
          value,
          onChange,
          onFocus: () => {},
          onBlur: () => {},
          onDragStart: () => {},
          onDrop: () => {},
        }}
        loadOptions={loadOptions}
        defaultOptions
        placeholder={t('serviceDashboard:SELECT_COMPANY')}
        styles={{ option: (base) => ({ ...base, wordBreak: 'break-all' }) }}
      />
    </div>
  );
};

export default CompanySelect;
