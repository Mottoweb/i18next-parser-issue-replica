import {
  createSelector,
} from 'reselect';
import {
  getNewsRoot as getRoot,
} from 'src/scenes/ServiceDashboard/selector';
import {
  List,
} from 'immutable';

export const news = createSelector(
  getRoot,
  (state) => state.get('news', new List()).take(2),
);
