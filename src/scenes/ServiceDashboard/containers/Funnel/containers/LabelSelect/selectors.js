import {
  createSelector,
} from 'reselect';
import {
  getLabelSelectRoot as getRoot,
} from '../../selectors';

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);
