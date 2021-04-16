import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import ReactSelectV2Field from 'src/components/ReactSelectV2Field';

import * as actions from './actions';
import * as selectors from './selectors';

export interface ITimeframeSelect {
  defaultTitle?: string
}

const TimeframeSelect: React.FC<ITimeframeSelect> = ({
  defaultTitle = 'SELECT_FINISHING_TIMEFRAME',
}) => {
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
      {/* @ts-expect-error: Property 'renderLayout' is missing in type */}
      <ReactSelectV2Field
        id="timeframe-select"
        input={{
          name: 'outcome-select',
          value,
          onChange,
          onFocus: () => {},
          onBlur: () => {},
          onDragStart: () => {},
          onDrop: () => {},
        }}
        placeholder={t(defaultTitle)}
        defaultOptions
        options={items}
        isClearable
        styles={{ option: (base: Record<string, unknown>) => ({ ...base, wordBreak: 'break-all' }) }}
      />
    </div>
  );
};

export default TimeframeSelect;
