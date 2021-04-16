import {
  createSelector,
} from 'reselect';
import {
  List,
} from 'immutable';
import {
  getRefs,
} from 'src/selectors';
import { getValue } from 'src/components/ReactSelectV2Field';
import {
  getCreatorSelectRoot as getRoot,
} from '../../selectors';

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);

export const getActiveId = createSelector(
  getActive,
  (active) => getValue(active),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total'),
);

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new List()),
);

export const getItems = createSelector(
  getRefs,
  (refs) => (refs.get('Creator')
    ? refs.get('Creator').map((item) => ({
      value: item.get('userId'),
      label: item.get('name'),
    }))
      .toList()
      .toJS()
    : []),
);
