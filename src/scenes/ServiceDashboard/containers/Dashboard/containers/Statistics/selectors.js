import {
  createSelector,
} from 'reselect';
import {
  getStatisiticsRoot as getRoot,
} from 'src/scenes/ServiceDashboard/selector';

export const loading = createSelector(
  getRoot,
  (state) => state.get('loading'),
);

export const data = createSelector(
  getRoot,
  (state) => state.get('data'),
);
