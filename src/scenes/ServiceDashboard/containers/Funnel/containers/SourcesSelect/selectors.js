import {
  createSelector,
} from 'reselect';
import {
  getSourcesSelectRoot as getRoot,
} from '../../selectors';

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);
