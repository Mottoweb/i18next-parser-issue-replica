import {
  createSelector,
} from 'reselect';
import {
  Map,
  List,
  OrderedSet,
} from 'immutable';
import createCachedSelector from 're-reselect';
import { TagDto, TagType } from '@adnz/api-ws-funnel';
import {
  getRefs,
  getItemId,
} from 'src/selectors';
import {
  getTagsRoot as getRoot,
} from '../../selectors';

export const getIds = createSelector<any, any, List<string>>(
  getRoot,
  (state) => state.get('ids', OrderedSet()).toList(),
);

export const getTotal = createSelector<any, any, number>(
  getRoot,
  (state) => state.get('total', 0),
);

const getTags = createSelector<any, any, Map<string, keyof TagDto>>(
  getRefs,
  (refs) => refs.get('TagDto', Map()),
);

export const getTag = createCachedSelector<any, any, string, Map<string, keyof TagDto>>(
  getTags,
  getItemId,
  (tags, itemId) => tags.get(itemId),
)(getItemId);

export const getTagTask = createCachedSelector<any, any, Map<string, keyof TagDto>, string | null>(
  getRefs,
  getTag,
  (refs, tag) => refs.getIn(['ShortTask', tag.get('lastAddedLead')], null),
)(getItemId);

export const isModalOpened = createSelector<any, any, boolean | undefined>(
  getRoot,
  (state) => !!state.get('isModalOpened'),
);

export const getOpenedId = createSelector<any, any, string>(
  getRoot,
  (state) => state.get('modalOpenedId'),
);

export const getInitialValues = createSelector<any, any, string, TagDto>(
  getTags,
  getOpenedId,
  (state, id) => ({
    name: state.getIn([id, 'name'], ''),
    type: TagType.SALESFUNNEL,
    active: state.getIn([id, 'active'], false),
  }),
);

export const getFilterAppliedValue = createSelector<any, any, string | undefined>(
  getRoot,
  (state) => state.get('filterValueApplied'),
);

export const getFilterValue = createSelector<any, any, string | undefined>(
  getRoot,
  (state) => state.get('filterValue'),
);
