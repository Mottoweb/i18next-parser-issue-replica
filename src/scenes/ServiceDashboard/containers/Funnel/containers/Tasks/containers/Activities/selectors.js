import {
  createSelector,
} from 'reselect';
import {
  Map,
  OrderedSet,
} from 'immutable';
import i18n from 'src/i18n';
import createCachedSelector from 're-reselect';
import {
  formValueSelector,
} from 'redux-form/immutable';
import {
  getItemId,
  getRefs,
  getLanguage,
  getInstance,
  getRoot as getConsoleRoot,
} from 'src/selectors';
import { fromDateTime, ActivityTypeEnumValues } from '@adnz/api-ws-activity';
import { MAX_INT } from 'src/constants';
import {
  getTasksRoot,
} from '../../../../selectors';
import {
  getActivitiesRoot as getRoot, getTaskId,
} from '../../selectors';
import { DEFAULT_ACTIVITIES_LIMIT } from './constants';

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new OrderedSet()).toList(),
);

export const getFormSelector = createSelector(
  getInstance,
  (instance) => formValueSelector(instance),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total', 0),
);

export const getActivity = createCachedSelector(
  getRefs,
  getItemId,
  (state, activityId) => state.getIn(['ActivityDto', activityId], new Map()),
)(getItemId);

export const getActivityContact = createCachedSelector(
  getRefs,
  getActivity,
  (state, activity) => state.getIn(['ContactShort', activity.get('contact')]),
)(getItemId);

export const getEditActivityId = createSelector(
  getRoot,
  (state) => state.get('openedActivityEditForm'),
);

export const getActiveContactType = createSelector(
  getRoot,
  (state) => state.get('selectedContactType'),
);

export const getContactIds = createSelector(
  getTasksRoot,
  getActiveContactType,
  (state, activeContactType) => {
    if (activeContactType === 'AGENCY') {
      return state.get('agencyContactIds', new OrderedSet()).toList();
    }
    if (activeContactType === 'BROKER') {
      return state.get('brokerContactIds', new OrderedSet()).toList();
    }
    return state.get('accountContactIds', new OrderedSet()).toList();
  },
);

export const getContactTypes = createSelector(
  () => ([
    { value: 'CLIENT', label: i18n.t('serviceDashboard:CLIENT') },
    { value: 'AGENCY', label: i18n.t('serviceDashboard:AGENCY') },
    { value: 'BROKER', label: i18n.t('serviceDashboard:BROKER') },
  ]),
);

export const getContacts = createSelector(
  getRefs,
  getContactIds,
  (state, ids) => ids
    .map((id) => state.getIn(['ContactDto', id]))
    .filter((v) => !!v),
);

export const getContactOptions = createSelector(
  getContacts,
  (contacts) => contacts.map((c) => ({
    value: c.get('id'),
    label: c.get('name'),
  })).toArray(),
);

export const getTopicIds = createSelector(
  getRoot,
  (state) => state.get('topicIds'),
);

export const getTopics = createSelector(
  getRefs,
  getTopicIds,
  (state, ids) => ids.map((id) => state.getIn(['TopicDto', id])),
);

export const isClickableActivity = createSelector(
  getActivity,
  getTaskId,
  (activity, taskId) => !!activity.get('taskId')
    && activity.get('taskId') !== null
    && activity.get('taskId') !== taskId,
);

export const getLabelValueTypes = createSelector(
  getLanguage,
  () => ActivityTypeEnumValues.map((item) => ({
    label: i18n.t(item),
    value: item,
  })),
);

const createFormActivityType = (state) => formValueSelector('create-activity')(state, 'activityType');

export const getIsMeeting = createSelector(
  createFormActivityType,
  (type) => (type ? type.value === 'MEETING' : false),
);

export const idsActivities = createSelector(
  getRoot,
  (state) => state.get('activityIds', new OrderedSet()).toList(),
);

export const getActivitiesLimit = createSelector(
  getRoot,
  (state) => (state.get('showAllActivities') ? MAX_INT : DEFAULT_ACTIVITIES_LIMIT),
);

export const isShownAllActivities = createSelector(
  getRoot,
  (state) => state.get('showAllActivities'),
);

export const isShownButtons = createSelector(
  getTotal,
  (total) => total > DEFAULT_ACTIVITIES_LIMIT,
);

export const getActivityInitialValues = createSelector(
  getActivity,
  getActivityContact,
  getLanguage,
  (item, contact) => new Map({
    message: item.get('message'),
    title: item.get('title'),
    date: fromDateTime(item.get('date')),
    contactId: contact ? { value: contact.get('id'), label: contact.get('name') } : null,
    activityType: { value: item.get('activityType'), label: i18n.t(item.get('activityType')) },
    entityId: item.get('entityId'),
    id: item.get('id'),
    entityType: 'ACCOUNT',
    contactType: { value: 'CLIENT', label: i18n.t('serviceDashboard:CLIENT') },
  }),
);

const getSelectedTopics = createSelector(
  getConsoleRoot,
  getFormSelector,
  (state, formSelector) => formSelector(state, 'topics'),
);

export const getSelectedTopicIds = createSelector(
  getSelectedTopics,
  (topics) => (topics ? topics.map((item) => item.value.id) : []),
);

export const getTopicOptions = createSelector(
  getRoot,
  getSelectedTopicIds,
  (state, ids) => (state.get('topicOptions')
    ? state.get('topicOptions').filter((option) => !ids.includes(option.value.id)).toJS() : null),
);

export const getActivityCreateFormInitialValues = createSelector(
  getItemId,
  getLanguage,
  (accountId) => new Map({
    message: '',
    title: '',
    entityId: accountId,
    entityType: 'ACCOUNT',
    notifySales: false,
    contactType: { value: 'CLIENT', label: i18n.t('serviceDashboard:CLIENT') },
    topics: [],
  }),
);
