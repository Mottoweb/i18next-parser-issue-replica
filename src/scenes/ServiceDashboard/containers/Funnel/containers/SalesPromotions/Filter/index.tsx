import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox, PageHeader, StyledCreatableSelect, Input,
} from '@adnz/ui';
import { Option } from 'src/types';
import { phaseOptions, statusOptions } from '../utils';
import {
  useDispatch,
  useSelector,
} from '../context';
import * as actions from '../actions';
import * as selectors from '../selectors';

const Filter:React.FC<{ hideStatusAndPhase?: boolean }> = ({ hideStatusAndPhase }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const searchFilter = useSelector(selectors.getSearchFilter, []);

  const dispatch = useDispatch();
  const onTextChange = React.useCallback(
    (e) => {
      dispatch(actions.SET_SEARCH_FILTER(e.target.value));
    },
    [dispatch],
  );

  const [statusFilter, setStatusFilter] = useState<Option<string>|null>(null);
  const [phaseFilter, setPhaseFilter] = useState<Option<string>|null>(null);
  const [includeInactive, setIncludeInactiveFilter] = useState<boolean>(false);

  const handleSetStatusFilter = React.useCallback(
    (e) => setStatusFilter(e),
    [setStatusFilter],
  );

  const handleSetPhaseFilter = React.useCallback(
    (e) => setPhaseFilter(e),
    [setPhaseFilter],
  );

  useEffect(() => {
    dispatch(actions.SET_FILTERS({
      phaseFilter: phaseFilter?.value ?? null,
      statusFilter: statusFilter?.value ?? null,
      includeInactive,
    }));
  }, [
    dispatch,
    phaseFilter,
    statusFilter,
    includeInactive,
  ]);

  useEffect(() => {
    dispatch(actions.SET_SEARCH_FILTER(''));
  }, [
    dispatch,
    hideStatusAndPhase,
  ]);

  return (
    <>
      <PageHeader.Search dataTestId="type-config-search">
        <Input
          onChange={onTextChange}
          type="text"
          value={searchFilter}
          placeholder={t('serviceDashboard:SEARCH')}
        />
      </PageHeader.Search>
      {!hideStatusAndPhase && (
        <>
          <PageHeader.Select dataTestId="status-filter">
            <StyledCreatableSelect<Option<string>, false>
              id="status-filter-select"
              placeholder={t('serviceDashboard:STATUS_FILTER')}
              onChange={handleSetStatusFilter}
              options={statusOptions}
              formatOptionLabel={(option) => t(option.label)}
              isClearable
              styles={{ option: (base: Record<string, unknown>) => ({ ...base, wordBreak: 'break-all' }) }}
              value={statusFilter}
            />
          </PageHeader.Select>
          <PageHeader.Select dataTestId="phase-filter">
            <StyledCreatableSelect<Option<string>, false>
              id="phase-filter-select"
              placeholder={t('serviceDashboard:PHASE_FILTER')}
              onChange={handleSetPhaseFilter}
              options={phaseOptions}
              formatOptionLabel={(option) => t(option.label)}
              isClearable
              styles={{ option: (base: Record<string, unknown>) => ({ ...base, wordBreak: 'break-all' }) }}
              value={phaseFilter}
            />
          </PageHeader.Select>
        </>
      )}
      {!!hideStatusAndPhase && (
        <PageHeader.Checkbox dataTestId="include-inactive-checkbox">
          <Checkbox
            checked={includeInactive}
            name="isShownincludeInactive"
            id="isShownincludeInactive"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIncludeInactiveFilter(e.target.checked)}
            square
          />
          {t('serviceDashboard:INCLUDE_INACTIVE')}
        </PageHeader.Checkbox>
      )}
    </>
  );
};

export default Filter;
