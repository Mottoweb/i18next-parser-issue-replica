import createCachedSelector from 're-reselect';
import {
  getSearchFilterRoot as getRoot,
} from 'src/scenes/ServiceDashboard/selector';

export const getType = (state, { type }) => type;

export const getValue = createCachedSelector(
  getRoot,
  getType,
  (state, type) => state.getIn([type, 'value'], ''),
)(getType);

export const getAppliedValue = createCachedSelector(
  getRoot,
  getType,
  (state, type) => state.getIn([type, 'appliedValue'], ''),
)(getType);
