import {
  createSelector,
} from 'reselect';
import {
  Map,
  OrderedSet,
} from 'immutable';
import createCachedSelector from 're-reselect';
import {
  getRefs,
  getItemId,
} from 'src/selectors';
import {
  getTaskTopicsRoot as getRoot,
} from '../../selectors';

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new OrderedSet()).toList(),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total', 0),
);

export const getTopics = createSelector(
  getRefs,
  (state) => state.get('TaskTopicDto', new Map()),
);

export const getTopic = createCachedSelector(
  getTopics,
  getItemId,
  (tags, itemId) => tags.get(itemId),
)(getItemId);

export const isModalOpened = createSelector(
  getRoot,
  (state) => state.get('isModalOpened'),
);

export const isDeleting = createCachedSelector(
  getRoot,
  getItemId,
  (state, itemId) => !!state.getIn(['deleting', itemId], false),
)(getItemId);

export const getOpenedId = createSelector(
  getRoot,
  (state) => state.get('modalOpenedId'),
);

export const isEditModal = createSelector(
  getRoot,
  (state) => !!state.get('modalOpenedId'),
);

export const getFilterValue = createSelector(
  getRoot,
  (state) => state.get('filterValue'),
);

export const getFilterAppliedValue = createSelector(
  getRoot,
  (state) => state.get('filterValueApplied'),
);

export const getInitialValues = createSelector(
  getTopics,
  getOpenedId,
  (state, id) => ({
    name: state.getIn([id, 'name'], ''),
    description: state.getIn([id, 'description'], ''),
  }),
);
