import {
  createSelector,
} from 'reselect';
import { List } from 'immutable';
import {
  getUserSelectRoot as getRoot,
} from '../../selectors';

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);

export const getSalesContacts = createSelector(
  getRoot,
  (state) => state.get('salesUser', new List())
    .sortBy((s) => s.get('name'))
    .map((contact) => ({
      value: contact.get('id'),
      label: contact.get('name'),
    }))
    .toList()
    .toJS(),
);
