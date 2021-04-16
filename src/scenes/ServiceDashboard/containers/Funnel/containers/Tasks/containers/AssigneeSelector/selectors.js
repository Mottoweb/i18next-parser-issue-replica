import {
  createSelector,
} from 'reselect';
import {
  List,
} from 'immutable';
import { getItemId } from 'src/selectors';
import createCachedSelector from 're-reselect';
import {
  getAssigneeSelectRoot as getRoot,
} from '../../selectors';

export const getActiveById = createCachedSelector(
  getRoot,
  getItemId,
  (state, itemId) => state.getIn(['active', itemId]),
)(getItemId);

export const isOpened = createSelector(
  getRoot,
  (state) => state.get('opened'),
);

export const isLoading = createSelector(
  getRoot,
  (state) => state.get('isLoading'),
);

export const isDefaultListLoading = createSelector(
  getRoot,
  (state) => state.get('isDefaultListLoading'),
);

export const getErrorMessage = createSelector(
  getRoot,
  (state) => state.get('errorMessage'),
);

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total'),
);

export const getItems = createSelector(
  getRoot,
  (state) => state.get('items', new List())
    .map((item) => ({
      value: item.get('userId'),
      label: item.get('name'),
    }))
    .toJS(),
);

export const getShownItems = createSelector(
  getItems,
  getActive,
  (items, activeItem) => items.filter((item) => item !== activeItem),
);
