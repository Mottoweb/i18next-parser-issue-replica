import {
  getRefs,
  getItemId,
  getInstance,
} from 'src/selectors';
import {
  OrderedSet,
} from 'immutable';
import createCachedSelector from 're-reselect';
import {
  getCampaignPositionsRoot as getRoot,
} from '../../selector';

export const getTotal = createCachedSelector(
  getRoot,
  getInstance,
  (state, instance) => state.getIn(['total', instance.toString()], 0),
)(getInstance);

export const getIds = createCachedSelector(
  getRoot,
  getInstance,
  (state, instance) => state.getIn(['ids', instance.toString()], new OrderedSet()).toList(),
)(getInstance);

export const getItem = createCachedSelector(
  getRefs,
  getItemId,
  (refs, itemId) => refs.getIn(['CampaignPositionDto', itemId.toString()]),
)(getItemId);

export const getItems = createCachedSelector(
  getIds,
  getRefs,
  (ids, refs) => ids.map((id) => refs.getIn(['CampaignPositionDto', id.toString()])),
)(getInstance);

export const amountHasData = createCachedSelector(
  getItems,
  (items) => items.some((item) => item.get('showAmount') !== false),
)(getInstance);
