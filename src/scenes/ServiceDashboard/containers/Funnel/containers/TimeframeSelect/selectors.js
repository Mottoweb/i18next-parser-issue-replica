import {
  createSelector,
} from 'reselect';
import { getLanguage } from 'src/selectors';
import i18n from 'src/i18n';
import { getValue } from 'src/components/ReactSelectV2Field';
import {
  getTimeframeSelectRoot as getRoot,
} from '../../selectors';

export const getActive = createSelector(
  getRoot,
  (state) => state.get('active'),
);

export const getActiveTimeframeId = createSelector(
  getActive,
  (state) => getValue(state),
);

export const getActiveId = createSelector(
  getActive,
  (active) => (active ? active.get('id') : null),
);

export const getItems = createSelector(
  getLanguage,
  () => ([
    { value: 'LAST_7_DAYS', label: i18n.t('serviceDashboard:LAST_WEEK') },
    { value: 'CURRENT_MONTH', label: i18n.t('serviceDashboard:CURRENT_MONTH') },
    { value: 'CURRENT_YEAR', label: i18n.t('serviceDashboard:CURRENT_YEAR') },
  ]),
);

export const getShownItems = createSelector(
  getItems,
  getActive,
  (items, activeItem) => items.filter((item) => item !== activeItem),
);
