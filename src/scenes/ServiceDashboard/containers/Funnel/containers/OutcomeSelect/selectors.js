import {
  createSelector,
} from 'reselect';
import { getLanguage } from 'src/selectors';
import i18n from 'src/i18n';
import { getValue } from 'src/components/ReactSelectV2Field';
import {
  getOutcomeSelectRoot as getRoot,
} from '../../selectors';

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);

export const getActiveId = createSelector(
  getActive,
  (state) => getValue(state),
);

export const getItems = createSelector(
  getLanguage,
  () => ([
    { value: 'OFFER_ACCEPTED', label: i18n.t('serviceDashboard:OFFER_ACCEPTED') },
    { value: 'OFFER_NOT_ACCEPTED', label: i18n.t('serviceDashboard:OFFER_NOT_ACCEPTED') },
  ]),
);

export const getShownItems = createSelector(
  getItems,
  getActive,
  (items, activeItem) => items.filter((item) => item !== activeItem),
);
