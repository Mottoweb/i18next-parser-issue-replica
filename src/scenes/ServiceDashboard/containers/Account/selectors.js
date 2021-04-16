import {
  createSelector,
} from 'reselect';
import {
  OrderedSet,
  List,
  Map,
} from 'immutable';
import {
  getAccountRoot as getRoot,
} from 'src/scenes/ServiceDashboard/selector';
import {
  getItemId,
  getRefs,
  getAccount,
  getTablesRoot,
} from 'src/selectors';
import createCachedSelector from 're-reselect';
import i18n from 'src/i18n';
import sanitizeHtml from 'sanitize-html';

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total', 0),
);

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new OrderedSet()).toList(),
);

export const getActivityIds = createSelector(
  getRoot,
  (state) => state.get('activityIds', new OrderedSet()).toList(),
);

export const getEditActivityId = createSelector(
  getRoot,
  (state) => state.get('openedActivityEditForm'),
);

const getOpenedEmailId = createSelector(
  getRoot,
  (state) => state.get('openedEmailModal'),
);

export const isEmailModalOpened = createSelector(
  getRoot,
  (state) => !!state.get('openedEmailModal'),
);

export const getEmail = createCachedSelector(
  getRefs,
  getItemId,
  (refs, EmailId) => {
    const email = refs.getIn(['AccountEmailDto', EmailId], new Map());
    const recipients = ((email.get('recipient') || '').split(',') || []);
    if (recipients.length > 3) {
      return email.setIn(['recipient_short'], `${recipients.slice(0, 3).join(',')}...`);
    }
    return email;
  },
)(getItemId);

export const getEmailBody = createSelector(
  getRefs,
  getOpenedEmailId,
  (refs, EmailId) => {
    const body = refs.getIn(['AccountEmailDto', EmailId, 'text'], '');
    if (!body) {
      return '';
    }
    return sanitizeHtml(body, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        '*': ['href', 'align', 'alt', 'center', 'colspan', 'rowspan'],
        img: ['src'],
      },
    });
  },
);

const getEmailAttachmentsIds = createSelector(
  getRefs,
  getOpenedEmailId,
  (refs, EmailId) => refs.getIn(['AccountEmailDto', EmailId, 'attachments'], new List()),
);

export const getEmailAttachments = createSelector(
  getRefs,
  getEmailAttachmentsIds,
  (refs, attachmentIds) => attachmentIds.map((id) => refs.getIn(['Attachment', id])).toList(),
);

export const getAttachment = createCachedSelector(
  getRefs,
  getItemId,
  (refs, AttachmentId) => refs.getIn(['Attachment', AttachmentId], new Map()),
)(getItemId);

export const getAccountDetails = createSelector(
  getRefs,
  getItemId,
  (refs, accountId) => refs.getIn(['AccountDto', accountId], new Map()),
);

const getActivities = createSelector(
  getRefs,
  (refs) => refs.get('ActivityDto', new Map()),
);

export const getActivity = createCachedSelector(
  getActivities,
  getItemId,
  (state, activityId) => state.get(activityId, new Map()),
)(getItemId);

export const getTagsIds = createCachedSelector(
  getActivity,
  (activity) => activity.get('tags', new Map()),
)(getItemId);

export const getActivityTaskId = createSelector(
  getActivity,
  (activity) => activity.get('taskId'),
);

export const isLoading = createSelector(
  getRoot,
  (state) => state.get('loading', false),
);

export const isActivitiesLoading = createSelector(
  getRoot,
  (state) => state.get('loadingActivities', false),
);

export const isCreateTaskModalOpened = createSelector(
  getRoot,
  (state) => state.get('isCreateTaskModalOpened', false),
);

export const isLoadingAttachment = createCachedSelector(
  getRoot,
  getItemId,
  (state, AttachmentId) => state.getIn(['loadingAttachment', AttachmentId]),
)(getItemId);

export const getCreateTaskInitialValues = createSelector(
  getAccountDetails,
  (account) => (new Map({
    accountId: {
      value: account.get('id'),
      label: account.get('displayName'),
    },
    agencyAccountId: !!account && !!account.get('defaultAgencyAccountId') ? {
      value: account.get('defaultAgencyAccountId'),
      label: account.get('defaultAgencyAccountName'),
    } : null,
    brokerAccountId: !!account && !!account.get('defaultBrokerAccountId') ? {
      value: account.get('defaultBrokerAccountId'),
      label: account.get('defaultBrokerAccountName'),
    } : null,
    priority: {
      label: i18n.t('serviceDashboard:LOW'),
      value: 'LOW',
    },
  })),
);

const getContactsFilter = createSelector(
  getTablesRoot,
  (state) => state.get('contacts-table', new Map()).toJS(),
);

export const getFilteredContacts = createSelector(
  getAccount,
  getRefs,
  getContactsFilter,
  (account, refs, filter) => {
    const contacts = account.get('contacts')
      .map((itemId) => refs.getIn(['ContactDto', itemId]));
    if (!filter.orderField) {
      return contacts;
    }
    const sortedContacts = contacts.sortBy((a) => a.get(filter.orderField));
    return filter.orderDirection === 'asc' ? sortedContacts : sortedContacts.reverse();
  },
);
