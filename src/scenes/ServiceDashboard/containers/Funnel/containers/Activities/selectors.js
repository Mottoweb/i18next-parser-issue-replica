import {
  createSelector,
} from 'reselect';
import {
  Map,
  List,
} from 'immutable';
import createCachedSelector from 're-reselect';
import {
  formValueSelector,
} from 'redux-form/immutable';
import {
  getItemId,
  getLanguage,
  getRefs,
  getInstance,
  getRoot as getConsoleRoot,
} from 'src/selectors';
import { getValue } from 'src/components/ReactSelectV2Field';
import i18n from 'src/i18n';
import { ActivityTypeEnumValues } from '@adnz/api-ws-activity';
import { fromDateTimeType } from '@adnz/api-helpers';
import moment from 'moment';
import {
  getActivitiesRoot as getRoot,
} from '../../selectors';

export const getMaxActivityDate = () => moment();

export const getFormSelector = createSelector(
  getInstance,
  (instance) => formValueSelector(instance),
);

const createFormActivityType = createSelector(
  getConsoleRoot,
  getFormSelector,
  (state, formSelector) => formSelector(state, 'activityType'),
);

export const getActiveContactType = createSelector(
  getConsoleRoot,
  getFormSelector,
  (state, formSelector) => getValue(formSelector(state, 'contactType')),
);

export const getSelectedAccountIdForContacts = createSelector(
  getRoot,
  getActiveContactType,
  (state, accountTypeFotContact) => state.get(accountTypeFotContact),
);

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new List()),
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

export const getLabelValueTypes = createSelector(
  getLanguage,
  () => ActivityTypeEnumValues.map((item) => ({
    label: i18n.t(item),
    value: item,
  })),
);

export const getContactTypes = createSelector(
  getLanguage,
  () => ([
    { value: 'accountId', label: i18n.t('serviceDashboard:CLIENT') },
    { value: 'agencyAccountId', label: i18n.t('serviceDashboard:AGENCY') },
    { value: 'brokerAccountId', label: i18n.t('serviceDashboard:BROKER') },
  ]),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total', 0),
);

export const getActivities = createSelector(
  getRefs,
  (state) => state.get('ActivityDto'),
);

export const getActivity = createCachedSelector(
  getRefs,
  getItemId,
  (state, activityId) => state.getIn(['ActivityDto', activityId]),
)(getItemId);

export const getActivityContact = createCachedSelector(
  getRefs,
  getActivity,
  (state, activity) => state.getIn(['ContactShort', activity.get('contact')]),
)(getItemId);

export const getActivityTaskId = createSelector(
  getActivity,
  (activity) => activity.get('taskId'),
);

export const getActivityAccountId = createSelector(
  getActivity,
  (activity) => (activity ? activity.get('entityId') : null),
);

export const getEditActivityId = createSelector(
  getRoot,
  (state) => state.get('openedActivityEditForm'),
);

export const getTagsIds = createCachedSelector(
  getActivity,
  (activity) => activity.get('tags', new Map()),
)(getItemId);

export const getActivityInitialValues = createSelector(
  getActivity,
  getActivityContact,
  getLanguage,
  (item, contact) => new Map({
    message: item.get('message'),
    title: item.get('title'),
    date: fromDateTimeType(item.get('date')),
    contactId: contact ? { value: contact.get('id'), label: contact.get('name') } : null,
    activityType: { value: item.get('activityType'), label: i18n.t(item.get('activityType')) },
    entityId: { value: item.get('entityId'), label: item.get('entityName') },
    id: item.get('id'),
    entityType: 'ACCOUNT',
    contactType: { label: i18n.t('serviceDashboard:CLIENT'), value: 'accountId' },
    topics: [],
  }),
);

export const getNowDate = createSelector(
  () => moment(),
);

export const getActivityCreateFormInitialValues = createSelector(
  getLanguage,
  () => new Map({
    message: '',
    entityType: 'ACCOUNT',
    contactType: { label: i18n.t('serviceDashboard:CLIENT'), value: 'accountId' },
    topics: [],
  }),
);

export const getIsMeeting = createSelector(
  createFormActivityType,
  (type) => (type ? type.value === 'MEETING' : false),
);

export const getCurrentContacts = createSelector(
  getRoot,
  (state) => state.get('contactsByAccount').map((contact) => ({
    label: contact.get('name'),
    value: contact.get('id'),
  }))
    .toList()
    .toJS(),
);

export const isCreateModalOpened = createSelector(
  getRoot,
  (state) => state.get('isCreateModalOpened'),
);
