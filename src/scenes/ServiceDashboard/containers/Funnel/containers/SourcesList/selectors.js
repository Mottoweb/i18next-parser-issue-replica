import {
  createSelector,
} from 'reselect';
import {
  Map,
  OrderedSet,
} from 'immutable';
import createCachedSelector from 're-reselect';
import i18n from 'src/i18n';
import {
  getRefs,
  getItemId,
} from 'src/selectors';
import {
  getSourcesRoot as getRoot,
} from '../../selectors';

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new OrderedSet()).toList(),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total', 0),
);

export const getSources = createSelector(
  getRefs,
  (refs) => refs.get('SourceDto', new Map()),
);

export const getSource = createCachedSelector(
  getSources,
  getItemId,
  (tags, itemId) => tags.get(itemId),
)(getItemId);

export const isModalOpened = createSelector(
  getRoot,
  (state) => state.get('isModalOpened'),
);

export const isShowingDescription = createSelector(
  getRoot,
  (state) => state.get('isShowingDescription'),
);

export const isBatchModalOpened = createSelector(
  getRoot,
  (state) => state.get('isBatchModalOpened'),
);

export const isDeleting = createCachedSelector(
  getRoot,
  getItemId,
  (state, itemId) => !!state.getIn(['deleting', itemId], false),
)(getItemId);

export const isDescriptionModalOpened = createSelector(
  getRoot,
  (state) => !!state.get('descriptionModalId'),
);

export const getDescriptionModalId = createSelector(
  getRoot,
  (state) => state.get('descriptionModalId'),
);

export const getDescriptionForModal = createSelector(
  getRefs,
  getDescriptionModalId,
  (refs, id) => refs.getIn(['SourceDto', id, 'description']),
);

export const getOpenedId = createSelector(
  getRoot,
  (state) => state.get('modalOpenedId'),
);

export const isEditModal = createSelector(
  getRoot,
  (state) => !!state.get('modalOpenedId'),
);

export const getBatchModalOpenedId = createSelector(
  getRoot,
  (state) => state.get('batchModalOpenedId'),
);

export const getInitialValues = createSelector(
  getSources,
  getOpenedId,
  (state, id) => new Map({
    name: state.getIn([id, 'name'], ''),
    description: state.getIn([id, 'description'], ''),
    priority: {
      value: state.getIn([id, 'priority'], 'LOW'),
      label: i18n.t(state.getIn([id, 'priority'], 'LOW')),
    },
  }),
);

export const getFilterValue = createSelector(
  getRoot,
  (state) => state.get('filterValue'),
);

export const getFilterAppliedValue = createSelector(
  getRoot,
  (state) => state.get('filterValueApplied'),
);

export const getBatchInitialValues = createSelector(
  getSources,
  getBatchModalOpenedId,
  (state, id) => new Map({
    campaign: { campaignId: '' },
    account: { accountId: '' },
    leadSource: { id },
    assignee: { id: '' },
    activity: { message: '' },
    tags: [],
    priority: {
      value: state.getIn([id, 'priority'], 'LOW'),
      label: i18n.t(state.getIn([id, 'priority'], 'LOW')),
    },
  }),
);
