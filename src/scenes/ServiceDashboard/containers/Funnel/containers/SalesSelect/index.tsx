import React from 'react';
import { useTranslation } from 'react-i18next';

import AsyncSelectField from 'src/components/form/fields/AsyncSelectField';

import { useSalesSelectContext } from './Context';
import { useSelectOptionsCacheContext } from './SelectOptionsCacheContext';

const meta = {};

export interface ISalesSelect {
  defaultTitle?: string
}

const SalesSelect: React.FC<ISalesSelect> = ({
  defaultTitle = 'SELECT_SALES_CONTACT',
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { loadOptions } = useSelectOptionsCacheContext();
  const [value, setValue] = useSalesSelectContext();

  const input = React.useMemo(
    () => ({
      name: 'account-sales-select',
      value,
      onChange: setValue,
      onFocus: () => {},
      onBlur: () => {},
      onDragStart: () => {},
      onDrop: () => {},
    }),
    [value, setValue],
  );

  return (
    <div className="flex-page__page-select">
      <AsyncSelectField
        id="sales-select"
        meta={meta}
        input={input}
        loadOptions={loadOptions}
        placeholder={t(defaultTitle)}
        isClearable
        defaultOptions
        styles={{ option: (base: Record<string, unknown>) => ({ ...base, wordBreak: 'break-all' }) }}
      />
    </div>
  );
};

export default React.memo(SalesSelect);
