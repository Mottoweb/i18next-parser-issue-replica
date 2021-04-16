import {
  createSelector,
} from 'reselect';
import {
  Map,
} from 'immutable';
import {
  getSalesFunnelRoot as getRoot,
} from 'src/scenes/Workflow/selector';

export const getTasksRoot = createSelector(
  getRoot,
  (state) => state.get('Tasks', new Map()),
);

export const getActivitiesRoot = createSelector(
  getRoot,
  (state) => state.get('Activities', new Map()),
);

export const getTagsRoot = createSelector(
  getRoot,
  (state) => state.get('Tags', new Map()),
);

export const getSourcesRoot = createSelector(
  getRoot,
  (state) => state.get('Sources', new Map()),
);

export const getTopicsRoot = createSelector(
  getRoot,
  (state) => state.get('Topics', new Map()),
);

export const getTaskTopicsRoot = createSelector(
  getRoot,
  (state) => state.get('TaskTopicsList', new Map()),
);

export const getLabelSelectRoot = createSelector(
  getRoot,
  (state) => state.get('LabelSelect', new Map()),
);

export const getSourcesSelectRoot = createSelector(
  getRoot,
  (state) => state.get('SourcesSelect', new Map()),
);

export const getSalesSelectRoot = createSelector(
  getRoot,
  (state) => state.get('SalesSelect', new Map()),
);

export const getUserSelectRoot = createSelector(
  getRoot,
  (state) => state.get('UserSelect', new Map()),
);

export const getCreatorSelectRoot = createSelector(
  getRoot,
  (state) => state.get('CreatorSelect', new Map()),
);

export const getContactSelectRoot = createSelector(
  getRoot,
  (state) => state.get('ContactSelect', new Map()),
);

export const getTimeframeSelectRoot = createSelector(
  getRoot,
  (state) => state.get('TimeframeSelect', new Map()),
);

export const getOutcomeSelectRoot = createSelector(
  getRoot,
  (state) => state.get('OutcomeSelect', new Map()),
);

export const getTopicSelectRoot = createSelector(
  getRoot,
  (state) => state.get('TopicSelect', new Map()),
);

export const getMeetingsRoot = createSelector(
  getRoot,
  (state) => state.get('Meetings', new Map()),
);
