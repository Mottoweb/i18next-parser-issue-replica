import { createSelector } from 'reselect';
import { getCompanySelectRoot as getRoot } from 'src/scenes/ServiceDashboard/selector';

export const getActiveValue = createSelector(
  getRoot,
  (state) => state.value,
);

export const getActiveId = createSelector(
  getActiveValue,
  (value) => ((value && value.value) ? value.value.companyUUID : null),
);
