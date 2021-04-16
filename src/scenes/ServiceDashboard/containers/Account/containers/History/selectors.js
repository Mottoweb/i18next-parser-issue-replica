import {
  createSelector,
} from 'reselect';
import {
  Map,
} from 'immutable';
import {
  getAccountRoot,
} from 'src/scenes/ServiceDashboard/selector';

export const getRoot = createSelector(
  getAccountRoot,
  (state) => state.get('history', new Map()),
);

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids'),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total'),
);
