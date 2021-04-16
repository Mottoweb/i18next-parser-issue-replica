import {
  createSelector,
} from 'reselect';
import {
  getRefs,
  getItemId,
} from 'src/selectors';
import {
  getHistory as getRoot,
} from 'src/scenes/ServiceDashboard/selector';

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids'),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total'),
);

export const getActivity = createSelector(
  getRefs,
  getItemId,
  (refs, itemId) => refs.getIn(['ActivityDto', itemId]),
);
