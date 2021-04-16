import {
  createSelector,
} from 'reselect';
import {
  getDealsRoot as getRoot,
} from '../../selector';

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids'),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total'),
);
