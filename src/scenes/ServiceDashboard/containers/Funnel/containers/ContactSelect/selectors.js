import {
  createSelector,
} from 'reselect';
import { getValue } from 'src/components/ReactSelectV2Field';
import {
  getContactSelectRoot as getRoot,
} from '../../selectors';

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);

export const getActiveId = createSelector(
  getActive,
  (active) => getValue(active),
);
