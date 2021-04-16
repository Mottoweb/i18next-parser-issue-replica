import {
  createSelector,
} from 'reselect';
import {
  Map,
} from 'immutable';
import {
  getInstance,
} from 'src/selectors';
import {
  getAccountRoot,
} from 'src/scenes/ServiceDashboard/selector';

export const getRoot = createSelector(
  getAccountRoot,
  (state) => state.get('numbers', new Map()),
);

export const getCount = createSelector(
  getRoot,
  getInstance,
  (state, instance) => state.getIn(['count', instance], 0),
);

export const isLoading = createSelector(
  getRoot,
  getInstance,
  (state, instance) => state.getIn(['loading', instance], false),
);
