import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactSelectV2Field from 'src/components/ReactSelectV2Field';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as selectors from './selectors';
import * as actions from './actions';

const SourcesSelect = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const value = useSelector(selectors.getActive);
  const dispatch = useDispatch();
  const onChange = React.useCallback(
    (v) => dispatch(actions.select(v, true)),
    [dispatch],
  );
  const { execute: loadOptions } = useEffectWithToken(
    (token, query) => actions.getOptions(token, query),
    [],
  );
  return (
    <div className="flex-page__page-select">
      <ReactSelectV2Field
        id="sources-select"
        input={{
          name: 'source-select',
          value,
          onChange,
          onFocus: () => {},
          onBlur: () => {},
          onDragStart: () => {},
          onDrop: () => {},
        }}
        placeholder={t('serviceDashboard:SELECT_SOURCE')}
        defaultOptions
        loadOptions={loadOptions}
        isClearable
        styles={{ option: (base) => ({ ...base, wordBreak: 'break-all' }) }}
      />
    </div>
  );
};

export default SourcesSelect;
