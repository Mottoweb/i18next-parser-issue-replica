import {
  createSelector,
} from 'reselect';
import {
  Map,
  List,
  OrderedSet,
} from 'immutable';
import createCachedSelector from 're-reselect';
import {
  formValueSelector,
} from 'redux-form/immutable';
import i18n from 'src/i18n';
import {
  getItemId,
  getInstance,
  getLanguage,
  getRefs,
} from 'src/selectors';
import { fromDateTime } from '@adnz/api-ws-funnel';
import { getValue } from 'src/components/ReactSelectV2Field';
import c from 'classnames';
import { DATE_ISO } from '@adnz/api-helpers';
import {
  getTasksRoot as getRoot,
} from '../../selectors';

export const getEmailFormRoot = createSelector(
  getRoot,
  (state) => state.get('EmailForm', new Map()),
);
export const getActivitiesRoot = createSelector(
  getRoot,
  (state) => state.get('activities', new Map()),
);

export const getTaskId = (state, props) => props.taskId;

export const getContactIdProp = (state, props) => props.contactId;

export const getAssigneeSelectRoot = createSelector(
  getRoot,
  (state) => state.get('AssigneeSelect', new Map()),
);

export const isModalOpened = createSelector(
  getRoot,
  (state) => state.get('isModalOpened'),
);

export const getOpenedFinishModal = createSelector(
  getRoot,
  (state) => state.get('openedFinishModal'),
);

export const getDeletedTaskId = createSelector(
  getRoot,
  (state) => state.get('openedDeleteModal'),
);

export const isDeletingLead = createSelector(
  getRoot,
  (state) => !!state.get('openedDeleteModal'),
);

export const isRestoringArchivedTask = createSelector(
  getRoot,
  (state) => !!state.get('openedRestoreArchivedModal'),
);

export const getRestoringArchivedTaskId = createSelector(
  getRoot,
  (state) => state.get('openedRestoreArchivedModal'),
);

export const getOpenedSnoozingModal = createSelector(
  getRoot,
  (state) => state.get('openedSnoozingModal'),
);

export const getSnoozedTask = createSelector(
  getRefs,
  getOpenedSnoozingModal,
  (state, id) => state.getIn(['TaskDto', id]),
);

export const isOpenedTaskSnoozed = createSelector(
  getSnoozedTask,
  (state) => state.get('status') === 'SNOOZED',
);

export const getSnoozeSelectedDate = createSelector(
  getRoot,
  (state) => state.get('selectedDate'),
);

export const isFinishingModalOpened = createSelector(
  getRoot,
  (state) => !!state.get('openedFinishModal'),
);

export const getOpenedDeclineModal = createSelector(
  getRoot,
  (state) => state.get('openedDeclineModal'),
);

export const isDeclineModalOpened = createSelector(
  getRoot,
  (state) => !!state.get('openedDeclineModal'),
);

export const getOpenedEmailModal = createSelector(
  getRoot,
  (state) => state.get('openedEmailModal'),
);

export const getEmailFormTaskId = createSelector(
  getRoot,
  (state) => state.get('emailFormTaskId'),
);

export const isEmailModalOpened = createSelector(
  getRoot,
  (state) => !!state.get('openedEmailModal'),
);

export const isSnoozingModalOpened = createSelector(
  getRoot,
  (state) => !!state.get('openedSnoozingModal'),
);

export const isSnoozingDateSelected = createSelector(
  getRoot,
  (state) => !!state.get('selectedDate'),
);

export const showTaskEditForm = createSelector(
  getRoot,
  (state) => state.get('showTaskEditForm'),
);

export const isFinishingTask = createSelector(
  getRoot,
  (state) => !!state.get('isFinishingTask'),
);

export const getOpenedRestoreModal = createSelector(
  getRoot,
  (state) => state.get('openedRestoreModal'),
);

export const isRestoreModalOpened = createSelector(
  getRoot,
  (state) => !!state.get('openedRestoreModal'),
);

export const getOpenedSourceModal = createSelector(
  getRoot,
  (state) => state.get('openedSourceDescriptionModal'),
);

export const isSourceDescriptionModalOpened = createSelector(
  getRoot,
  (state) => !!state.get('openedSourceDescriptionModal'),
);

export const getTaskTotal = createCachedSelector(
  getRoot,
  getInstance,
  (state, instance) => state.getIn(['tasks', 'total', instance.toString()], 0),
)(getInstance);

export const getTaskIds = createCachedSelector(
  getRoot,
  getInstance,
  (state, instance) => state.getIn(['tasks', 'ids', instance.toString()], new OrderedSet()).toList(),
)(getInstance);

export const getIds = createSelector(
  getRoot,
  (state) => state.get('ids', new OrderedSet()).toList(),
);

export const getTotal = createSelector(
  getRoot,
  (state) => state.get('total', 0),
);

const getTasks = createSelector(
  getRefs,
  (state) => state.get('TaskDto', new Map()),
);

export const getIsAllCampaignsShownOnFinish = createSelector(
  getRoot,
  (state) => state.get('isAllCampaignsShownOnFinish', false),
);

export const getTask = createCachedSelector(
  getTasks,
  getItemId,
  (tasks, itemId) => tasks.get(itemId, new Map()),
)(getItemId);

export const getFinishingTaskCreationDateFilter = createSelector(
  getIsAllCampaignsShownOnFinish,
  getTasks,
  getOpenedFinishModal,
  (showAll, tasks, itemId) => (showAll ? null : fromDateTime(tasks.getIn([itemId, 'created']))?.format(DATE_ISO)),
);

export const availableAccountCampaigns = createSelector(
  getRoot,
  (state) => (state.get('availableAccountCampaigns') ? state.get('availableAccountCampaigns') : null),
);

export const getAccountId = createSelector(
  getTask,
  (state) => state.get('account'),
);

export const getTaskContactIds = createSelector(
  getTask,
  (state) => state.get('defaultContacts'),
);

const getSourceId = createSelector(
  getTask,
  (state) => state.get('leadSource'),
);

const getCreatorId = createSelector(
  getTask,
  (state) => state.get('creator'),
);

const getAssigneeId = createSelector(
  getTask,
  (state) => state.get('assignee'),
);

const getAssignAuthorId = createSelector(
  getTask,
  (state) => state.get('assignAuthor'),
);

export const getActivityId = createSelector(
  getTask,
  (state) => state.get('activity'),
);

const getCampaignId = createSelector(
  getTask,
  (state) => state.get('campaign'),
);

const getTagsList = createSelector(
  getTask,
  (state) => state.get('tags', new List()),
);

const getTaskStatusColor = createSelector(
  getTask,
  (state) => state.get('activityStatusColor'),
);

function getIndicatorPopUp(color) {
  if (color === 'GREEN') {
    return 'GREEN_TASK_MASSAGE';
  }
  if (color === 'YELLOW') {
    return 'YELLOW_TASK_MESSAGE';
  }
  return 'RED_TASK_MESSAGE';
}

export const getTaskStatusMessage = createCachedSelector(
  getTaskStatusColor,
  (color) => getIndicatorPopUp(color),
)(getItemId);

export const getTaskStatusClass = createCachedSelector(
  getTask,
  (task) => c(
    { 'dash-td__span_success': task.get('activityStatusColor') === 'GREEN' },
    { 'dash-td__span_warning': task.get('activityStatusColor') === 'YELLOW' },
    { 'dash-td__span_danger': task.get('activityStatusColor') === 'RED' },
  ),
)(getItemId);

export const getFinishedTaskStatusClass = createCachedSelector(
  getTask,
  (task) => c(
    {
      'dash-td__span_success':
        task.get('outcome') === 'OFFER_ACCEPTED' || task.get('outcome') === 'SUCCESSFULL_WITHOUT_OFFER',
    },
    { 'dash-td__span_warning': task.get('outcome') === 'OTHER' },
    {
      'dash-td__span_danger':
        task.get('outcome') !== 'OFFER_ACCEPTED'
        && task.get('outcome') !== 'OTHER'
        && task.get('outcome') !== 'SUCCESSFULL_WITHOUT_OFFER',
    },
  ),
)(getItemId);

export const getTagsByTaskId = createCachedSelector(
  getRefs,
  getTagsList,
  (refs, tags) => tags.map((tag) => refs.getIn(['TagDto', tag], new Map())),
)(getItemId);

export const getCampaignByTaskId = createCachedSelector(
  getRefs,
  getCampaignId,
  (refs, itemId) => refs.getIn(['CampaignDto', itemId], new Map()),
)(getItemId);

export const getCreatorByTaskId = createCachedSelector(
  getRefs,
  getCreatorId,
  (refs, itemId) => refs.getIn(['UserShort', itemId], new Map()),
)(getItemId);

export const getAccountByTaskId = createCachedSelector(
  getRefs,
  getAccountId,
  (refs, itemId) => refs.getIn(['AccountDto', itemId], new Map()),
)(getItemId);

export const getAgencyAccountIdByTaskId = createSelector(
  getTask,
  (state) => state.get('agencyAccount'),
);

export const getBrokerAccountIdByTaskId = createSelector(
  getTask,
  (state) => state.get('brokerAccount'),
);

export const getAgencyAccountByTaskId = createCachedSelector(
  getRefs,
  getAgencyAccountIdByTaskId,
  (refs, itemId) => refs.getIn(['AccountDto', itemId]),
)(getItemId);

export const getAgencyAccountByTaskIdLabelValue = createCachedSelector(
  getRefs,
  getAccountByTaskId,
  getAgencyAccountIdByTaskId,
  (refs, account, itemId) => {
    const agencyAccount = refs.getIn(['AccountDto', itemId]);

    if (agencyAccount) {
      return {
        label: agencyAccount.get('displayName'),
        value: agencyAccount.get('id'),
      };
    }

    return account.get('defaultAgencyAccountId') ? {
      label: account.get('defaultAgencyAccountName'),
      value: account.get('defaultAgencyAccountId'),
    } : null;
  },
)(getItemId);

export const getBrokerAccountByTaskId = createCachedSelector(
  getRefs,
  getBrokerAccountIdByTaskId,
  (refs, itemId) => refs.getIn(['AccountDto', itemId]),
)(getItemId);

export const getBrokerAccountByTaskIdLabelValue = createCachedSelector(
  getRefs,
  getAccountByTaskId,
  getBrokerAccountByTaskId,
  (refs, account, brokerAccount) => {
    if (brokerAccount) {
      return {
        label: brokerAccount.get('displayName'),
        value: brokerAccount.get('id'),
      };
    }

    return account.get('defaultBrokerAccountId') ? {
      label: account.get('defaultBrokerAccountName'),
      value: account.get('defaultBrokerAccountId'),
    } : null;
  },
)(getItemId);

export const isTaskContact = createSelector(
  getRefs,
  getContactIdProp,
  (refs, contactId) => refs.getIn(['ContactDto', contactId, 'isTaskContact']),
);

export const getAssigneeByTaskId = createCachedSelector(
  getRefs,
  getAssigneeId,
  (refs, itemId) => refs.getIn(['UserShort', itemId], new Map()),
)(getItemId);

export const isTopicNotEditable = createCachedSelector(
  getTask,
  (task) => task.get('status') !== 'NEW',
)(getItemId);

export const getAssignAuthorByTaskId = createCachedSelector(
  getRefs,
  getAssignAuthorId,
  (refs, itemId) => refs.getIn(['UserShort', itemId], new Map()),
)(getItemId);

export const getTaskContactEmailsByTaskId = createCachedSelector(
  getRefs,
  getTaskContactIds,
  (refs, ids) => (!!ids && ids.size > 0 ? ids.map((id) => refs.getIn(['ContactDto', id, 'email'])) : null),
)(getItemId);

export const getActivityByTaskId = createSelector(
  getRefs,
  getActivityId,
  (refs, itemId) => refs.getIn(['ActivityDto', itemId]),
);

export const getAccountIdForFinishingModal = createSelector(
  getRefs,
  getOpenedFinishModal,
  (refs, taskId) => refs.getIn(['TaskDto', taskId, 'account']),
);

export const getWithOfferSelected = createSelector(
  getRoot,
  (state) => !!state.get('withOfferFinishing'),
);

const getFinishForm = formValueSelector('finish-task-form');

const getSelectedCampaignIdFromFinishing = (state) => getValue(getFinishForm(state, 'campaignId'));

export const getSubmitIsDisabled = createSelector(
  getWithOfferSelected,
  getSelectedCampaignIdFromFinishing,
  (withOffer, campaignId) => withOffer && !campaignId,
);

export const getSourceByTaskId = createCachedSelector(
  getRefs,
  getSourceId,
  (refs, itemId) => refs.getIn(['SourceDto', itemId], new Map()),
)(getItemId);

export const getTaskTopicIdByTask = createCachedSelector(
  getTask,
  (task) => task.get('taskTopic'),
)(getItemId);

export const getTaskTopicByTaskId = createCachedSelector(
  getRefs,
  getTaskTopicIdByTask,
  (refs, topicId) => refs.getIn(['TaskTopicDto', topicId], null),
)(getItemId);

export const getTaskTopicName = createCachedSelector(
  getTaskTopicByTaskId,
  (topic) => (topic ? topic.get('name') : ''),
)(getItemId);

export const getSourceDescriptionForModal = createCachedSelector(
  getRefs,
  getOpenedSourceModal,
  (refs, itemId) => refs.getIn(['SourceDto', itemId, 'description']),
)(getOpenedSourceModal);

export const geSourceBySourceId = createCachedSelector(
  getRefs,
  getItemId,
  (refs, itemId) => refs.getIn(['SourceDto', itemId], new Map()),
)(getItemId);

export const getPriorityBySourceId = createCachedSelector(
  geSourceBySourceId,
  (source) => source.get('priority'),
)(getItemId);

export const deletingTag = createCachedSelector(
  getRoot,
  getItemId,
  (state, itemId) => !!state.getIn(['deletingTag', itemId], false),
)(getItemId);

export const getInitialValues = createSelector(
  getTasks,
  getItemId,
  getTask,
  getCampaignByTaskId,
  getAccountByTaskId,
  getAgencyAccountByTaskIdLabelValue,
  getBrokerAccountByTaskIdLabelValue,
  getSourceByTaskId,
  getTaskTopicByTaskId,
  getAssigneeByTaskId,
  getTagsByTaskId,
  getLanguage,
  (
    state,
    taskId,
    Task,
    Campaign,
    Account,
    agencyAccountId,
    brokerAccountId,
    Source,
    TaskTopic,
    Assignee,
    Tags,
  ) => (new Map({
    campaignId: Campaign.get('campaignId')
      ? {
        value: Campaign.get('campaignId'),
        label: Campaign.get('name'),
      } : null,
    accountId: { value: Account.get('id'), label: Account.get('displayName') },
    agencyAccountId: Task.get('agencyAccount') ? agencyAccountId : null,
    brokerAccountId: Task.get('brokerAccount') ? brokerAccountId : null,
    leadSource: { value: Source.get('id'), label: Source.get('name') },
    taskTopic: TaskTopic ? { value: TaskTopic.get('id'), label: TaskTopic.get('name') } : null,
    assignee: Assignee.get('id') ? { value: Assignee.get('id'), label: Assignee.get('name') } : null,
    priority: { label: i18n.t(Task.get('priority')), value: Task.get('priority') },
    title: Task.get('title'),
    tags: Tags.size > 0 ? Tags.map((tag) => ({ value: tag.get('id'), label: tag.get('name') })).toJS() : null,
    isImportant: Task.get('isImportant'),
  })),
);

export const getCreateInitialValues = createSelector(
  getLanguage,
  () => (new Map({
    priority: { label: i18n.t('serviceDashboard:LOW'), value: 'LOW' },
  })),
);

export const getActiveContactTypes = createSelector(
  getRoot,
  (state) => state.get('contactTypeSelected'),
);

export const getContactIds = createSelector(
  getRoot,
  getActiveContactTypes,
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

export const getContacts = createSelector(
  getRefs,
  (refs) => refs.get('ContactDto', new Map()),
);

export const getContact = createSelector(
  getContacts,
  getContactIdProp,
  (state, contactId) => state.get(contactId),
);

export const getOpenedEmailModalContact = createSelector(
  getContacts,
  getOpenedEmailModal,
  (state, contactId) => state.get(contactId),
);

const getSignature = createSelector(
  getRoot,
  (state) => state.get('emailSignature'),
);

const getSyncInfo = createSelector(
  getRoot,
  (state) => state.get('syncInfo'),
);

export const isGmailSync = createSelector(
  getSyncInfo,
  (syncInfo) => (syncInfo ? syncInfo.get('hasCredentials') : false),
);

export const isLoadingEmailModal = createSelector(
  getRoot,
  getContactIdProp,
  (state, contactId) => contactId === state.get('loadingEmailModal'),
);

export const isDisabledEmailButton = createSelector(
  isLoadingEmailModal,
  getContact,
  isGmailSync,
  (
    isLoading,
    contact,
    isSync,
  ) => !isSync || !contact.get('email') || !contact.get('isTaskContact') || isLoading
  ,
);

export const getEmailFormAccountId = createSelector(
  getRefs,
  getEmailFormTaskId,
  (state, taskId) => state.getIn(['TaskDto', taskId, 'account']),
);

export const getEmailFormInitialValues = createSelector(
  getEmailFormAccountId,
  getOpenedEmailModalContact,
  getSignature,
  (accountId, contact, signature) => ({
    content: signature,
    subject: '',
    accountId,
    toEmails: contact ? contact.get('email') : '',
  }),
);

export const getFinishingTask = createSelector(
  getRefs,
  getOpenedFinishModal,
  (state, itemId) => state.getIn(['TaskDto', itemId]),
);

export const getFinishOptionsWithoutOffer = createSelector(
  getLanguage,
  () => ([
    { value: 'NOT_REACHED', label: i18n.t('serviceDashboard:NOT_REACHED') },
    { value: 'NOT_INTERESTED', label: i18n.t('serviceDashboard:NOT_INTERESTED') },
    { value: 'SUCCESSFULL_WITHOUT_OFFER', label: i18n.t('serviceDashboard:SUCCESSFULL_WITHOUT_OFFER') },
  ]),
);

export const getArchiveOutcomeOptions = createSelector(
  getLanguage,
  () => ([
    { value: 'DUPLICATE', label: i18n.t('serviceDashboard:DUPLICATE') },
    { value: 'NO_POTENTIAL', label: i18n.t('serviceDashboard:NO_POTENTIAL') },
    { value: 'AGED', label: i18n.t('serviceDashboard:AGED') },
  ]),
);

export const getArchiveTaskInitialValue = createSelector(
  getLanguage,
  () => (new Map({ outcome: { value: 'NO_POTENTIAL', label: i18n.t('serviceDashboard:NO_POTENTIAL') } })),
);

export const getFinishTaskCampaign = createSelector(
  getRefs,
  getFinishingTask,
  (state, task) => state.getIn(['CampaignDto', task.get('campaign')]),
);

export const getFinishTaskInitialValue = createSelector(
  getFinishTaskCampaign,
  getWithOfferSelected,
  getFinishOptionsWithoutOffer,
  (campaign, withOfferSelected, options) => (!!campaign && withOfferSelected
    ? new Map({ campaignId: { value: campaign.get('campaignId'), label: campaign.get('name') } })
    : new Map({
      outcome: {
        value: options[0].value,
        label: options[0].label,
      },
    })),
);

export const getCreateContactModalOpened = createSelector(
  getRoot,
  (state) => state.get('createContactModalOpened'),
);

export const getAddContactInitialValues = () => new Map({
  phone: '+41',
});
