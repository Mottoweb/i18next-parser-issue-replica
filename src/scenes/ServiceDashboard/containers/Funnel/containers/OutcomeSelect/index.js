import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactSelectV2Field from 'src/components/ReactSelectV2Field';
import * as selectors from './selectors';
import * as actions from './actions';

const OutcomeSelect = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const items = useSelector(selectors.getShownItems);
  const value = useSelector(selectors.getActive);
  const dispatch = useDispatch();
  const onChange = React.useCallback(
    (v) => dispatch(actions.select(v, true)),
    [dispatch],
  );
  return (
    <div className="flex-page__page-select">
      <ReactSelectV2Field
        id="outcome-select"
        input={{
          name: 'outcome-select',
          value,
          onChange,
          onFocus: () => {},
          onBlur: () => {},
          onDragStart: () => {},
          onDrop: () => {},
        }}
        placeholder={t('serviceDashboard:SELECT_OUTCOME')}
        defaultOptions
        options={items}
        isClearable
        styles={{ option: (base) => ({ ...base, wordBreak: 'break-all' }) }}
      />
    </div>
  );
};

export default OutcomeSelect;
