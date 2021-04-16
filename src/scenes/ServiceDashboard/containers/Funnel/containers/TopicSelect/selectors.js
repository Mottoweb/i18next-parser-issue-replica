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
  getTopicSelectRoot as getRoot,
} from '../../selectors';

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);

export const getActiveId = createSelector(
  getActive,
  (active) => getValue(active),
);

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new List()),
);

export const getItems = createSelector(
  getRefs,
  getIds,
  (state, ids) => ids.map((id) => ({
    value: state.getIn(['TopicDto', id, 'id']),
    label: state.getIn(['TopicDto', id, 'title']),
  }))
    .sortBy((s) => s.label)
    .toList()
    .toJS(),
);

export const getShownItems = createSelector(
  getItems,
  getActive,
  (items, activeItem) => items.filter((item) => item !== activeItem),
);
