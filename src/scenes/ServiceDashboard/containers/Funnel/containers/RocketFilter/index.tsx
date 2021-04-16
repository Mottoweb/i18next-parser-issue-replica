import React from 'react';
import { PageHeader, Checkbox } from '@adnz/ui';
import { ICONS } from 'src/constants';
import { TaskFilterContext } from './context';

const RocketFilter: React.FC = () => {
  const { onlyImportant, changeOnlyImportantFilter } = React.useContext(TaskFilterContext);
  const handleChange = React.useCallback(
    () => {
      changeOnlyImportantFilter(!onlyImportant);
    },
    [changeOnlyImportantFilter, onlyImportant],
  );
  return (
    <PageHeader.Checkbox dataTestId="filter-rocket">
      <Checkbox
        onChange={handleChange}
        checked={!!onlyImportant}
        square
      />
      {String.fromCodePoint(ICONS.ROCKET)}
    </PageHeader.Checkbox>
  );
};

export default React.memo(RocketFilter);
