import { Moment } from 'moment';
import { CancelToken } from 'axios';
import {
  createAction,
} from 'redux-actions';
import {
  Map,
  fromJS,
} from 'immutable';
import { getGmailAuthorizeUrl, getGmailSignature } from '@adnz/api-ws-email-sync';
import {
  handleFormErrors,
} from 'src/helpers';
import axios from 'axios';
import {
  change,
  formValueSelector,
} from 'redux-form/immutable';
import {
  TaskFilter, assignTask, getSources, getSourcesSchema, getTags as getTagsApi,
  addContactAsDefault as addContactAsDefaultApi, addContactAsDefaultSchema,
  removeTaskContactFromDefault as removeTaskContactFromDefaultApi, removeTaskContactFromDefaultSchema,
  TagType, getTaskContacts, getTaskContactsSchema,
  EmailTemplate, getSalesPersons,
  ContactSourceInline,
  getTaskContactsParameters,
  getTask as getTaskApi, getTaskSchema,
  updateTask as updateTaskApi, updateTaskSchema,
  archiveTask as archiveTaskApi, archiveTaskSchema,
  updateTaskSnoozedTime as updateTaskSnoozedTimeApi, updateTaskSnoozedTimeSchema,
  finishTask as finishTaskApi, finishTaskSchema,
  restoreTask as restoreTaskApi, restoreTaskSchema,
  sendEmailToContact as sendEmailToContactApi, sendEmailToContactSchema,
  restoreArchivedTask as restoreArchivedTaskApi, restoreArchivedTaskSchema,
  getTaskTopics as getTaskTopicsApi, getTaskTopicsSchema,
  getPaginatedTasks, TaskDto, createTask, createTaskSchema, getPaginatedTasksSchema,
} from '@adnz/api-ws-funnel';
import {
  getAccountById, getAgencyCampaigns, getAllOwnedAccountsShort,
} from '@adnz/api-ws-salesforce';

import i18n from 'src/i18n';
import { Dispatch } from 'redux';
import { getValue } from 'src/components/ReactSelectV2Field';

import * as selectors from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/selectors';
import * as actionTypes from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/actionTypes';
import { TaskForm } from 'src/scenes/ServiceDashboard/containers/Funnel/containers/Tasks/types';
import { DateType, DATE_ISO } from '@adnz/api-helpers';
import legacyNormalize from 'src/utils/legacyNormalize';

export type GetTasks = (
  props: {
    filters: any
    token: CancelToken
  } & TaskFilter,
  instance: string
) => (dispatch: Dispatch) => Promise<any>;

export const getTasks: GetTasks = ({ filters, ...args }, instance) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.LOAD_TASKS.STARTED)({
      result: Map(),
      instance,
    }));
    const { data } = await getPaginatedTasks({
      limit: args.limit,
      page: args.page,
      sort: args.sort,
      order: args.order,
      ...filters,
      labelId: getValue(filters.labelId),
      sourceId: getValue(filters.sourceId),
      assigneeId: getValue(filters.assigneeId),
    }, args.token);
    const normalized = legacyNormalize(data, getPaginatedTasksSchema);
    dispatch(createAction(actionTypes.LOAD_TASKS.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      total: normalized.getIn(['result', 'total']),
      ids: normalized.getIn(['result', 'items']),
      instance,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, { instance });
      dispatch(createAction(actionTypes.LOAD_TASKS.FAILED)(reducedErr));
    }
  }
}

export type GetContacts = (
  args: {
    filters: any
  } & getTaskContactsParameters,
  token: CancelToken
) => (dispatch: Dispatch) => Promise<any>;

export const getContacts: GetContacts = (args, token) => async (dispatch) => {
  try {
    dispatch(createAction(actionTypes.LOAD_CONTACTS.STARTED)({
      result: Map(),
    }));
    const { data } = await getTaskContacts(args.filters, token);
    const normalized = legacyNormalize(data, getTaskContactsSchema);
    dispatch(createAction(actionTypes.LOAD_CONTACTS.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.LOAD_CONTACTS.FAILED)(err));
    }
  }
}

export const addContactAsDefault = (taskId: string, contactId: string) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.ADD_CONTACT_TO_DEFAULT.STARTED)());
  return addContactAsDefaultApi({ taskId, contactId })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, addContactAsDefaultSchema);
        return dispatch(createAction(actionTypes.ADD_CONTACT_TO_DEFAULT.COMPLETED)({
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.ADD_CONTACT_TO_DEFAULT.FAILED)(err)),
    );
};

export const removeTaskContactFromDefault = (taskId: string, contactId: string) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.REMOVE_CONTACT_FROM_DEFAULT.STARTED)());
  return removeTaskContactFromDefaultApi({ taskId, contactId })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, removeTaskContactFromDefaultSchema);
        return dispatch(createAction(actionTypes.REMOVE_CONTACT_FROM_DEFAULT.COMPLETED)({
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.REMOVE_CONTACT_FROM_DEFAULT.FAILED)(err)),
    );
};

export const getTask = (token: CancelToken, taskId: string) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.LOAD_TASK.STARTED)());
  return getTaskApi({ taskId }, token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getTaskSchema);
        return dispatch(createAction(actionTypes.LOAD_TASK.COMPLETED)({
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.LOAD_TASK.FAILED)(err)),
    );
};

export const deleteLeed = (outcome: string) => async (dispatch: any, getState: any) => {
  const taskId = selectors.getDeletedTaskId(getState());
  try {
    dispatch(createAction(actionTypes.DELETE_TASK.STARTED)({
      result: Map(),
      instance: 'tasks-NEW',
      id: taskId,
    }));
    const { data } = await archiveTaskApi({ taskId, outcome });
    const normalized = legacyNormalize(data, archiveTaskSchema);
    dispatch(createAction(actionTypes.DELETE_TASK.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      instance: 'tasks-NEW',
      id: taskId,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, {
        instance: 'tasks-NEW',
        id: taskId,
      });
      dispatch(createAction(actionTypes.DELETE_TASK.FAILED)(reducedErr));
    }
  }
}

export const restoreArchivedTask = () => async (dispatch: any, getState: any) => {
  const taskId = selectors.getRestoringArchivedTaskId(getState());
  try {
    dispatch(createAction(actionTypes.RESTORE_ARCHIVED_TASK.STARTED)({
      result: Map(),
      instance: 'tasks-ARCHIVED',
      id: taskId,
    }));
    const { data } = await restoreArchivedTaskApi({ taskId });
    const normalized = legacyNormalize(data, restoreArchivedTaskSchema);
    dispatch(createAction(actionTypes.RESTORE_ARCHIVED_TASK.COMPLETED)({
      instance: 'tasks-ARCHIVED',
      id: taskId,
      entities: normalized.get('entities'),
      result: normalized.get('result'),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, {
        instance: 'tasks-ARCHIVED',
        id: taskId,
      });
      dispatch(createAction(actionTypes.RESTORE_ARCHIVED_TASK.FAILED)(reducedErr));
    }
  }
}

export const create = (data: TaskForm) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.CREATE_TASK.STARTED)());
  return createTask(data as TaskDto)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, createTaskSchema);
        return dispatch(createAction(actionTypes.CREATE_TASK.COMPLETED)({
          instance: !data.assignee ? 'tasks-NEW' : 'tasks-IN_PROGRESS',
          ids: normalized.get('result'),
          entities: normalized.get('entities'),
        }));
      },
      handleFormErrors,
    );
};

export const update = (taskId: string, data: TaskForm) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.UPDATE_TASK.STARTED)());
  return updateTaskApi(data as TaskDto, { taskId })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, updateTaskSchema);
        return dispatch(createAction(actionTypes.UPDATE_TASK.COMPLETED)({
          taskId,
          entities: normalized.get('entities'),
        }));
      },
      handleFormErrors,
    );
};

export const setAssignee = (taskId: string, assigneeId: string) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.SET_ASSIGNEE.STARTED)());
  return assignTask({ taskId, assigneeId })
    .then(
      () => dispatch(createAction(actionTypes.SET_ASSIGNEE.COMPLETED)({
        instance: 'tasks-NEW',
        id: taskId,
      })),
      (err) => dispatch(createAction(actionTypes.SET_ASSIGNEE.FAILED)(err)),
    );
};

export const finishTask = (
  negativeOutcome: string,
  comment: string,
  campaignId: string,
  taskIdIn?: string,
) => (dispatch: any, getState: any) => {
  const taskId = taskIdIn || selectors.getOpenedFinishModal(getState()) || selectors.getOpenedDeclineModal(getState());
  const outcome = selectors.getWithOfferSelected(getState()) ? 'OFFER_ACCEPTED' : negativeOutcome;
  dispatch(createAction(actionTypes.FINISH_TASK.STARTED)());
  return finishTaskApi({
    taskId, campaignId, outcome, comment,
  })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, finishTaskSchema);
        return dispatch(createAction(actionTypes.FINISH_TASK.COMPLETED)({
          entities: normalized.get('entities'),
          activityId: normalized.getIn(['entities', 'TaskDto', normalized.get('result'), 'activity']),
        }));
      },
      (err) => dispatch(createAction(actionTypes.FINISH_TASK.FAILED)(err)),
    );
};

export const restoreTask = (comment?: string) => (dispatch: Dispatch, getState: any) => {
  const taskId = selectors.getOpenedRestoreModal(getState());
  dispatch(createAction(actionTypes.RESTORE_TASK.STARTED)());
  return restoreTaskApi({ taskId, comment })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, restoreTaskSchema);
        return dispatch(createAction(actionTypes.RESTORE_TASK.COMPLETED)({
          entities: normalized.get('entities'),
          activityId: normalized.getIn(['entities', 'TaskDto', normalized.get('result'), 'activity']),
        }));
      },
      (err) => dispatch(createAction(actionTypes.RESTORE_TASK.FAILED)(err)),
    );
};

export const sendEmail = (args: EmailTemplate & { accountId: string }) => (dispatch: Dispatch, getState: any) => {
  const taskId = selectors.getEmailFormTaskId(getState());
  dispatch(createAction(actionTypes.SEND_EMAIL.STARTED)());
  return sendEmailToContactApi(args, { taskId, accountId: args.accountId })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, sendEmailToContactSchema);
        return dispatch(createAction(actionTypes.SEND_EMAIL.COMPLETED)({
          entities: normalized.get('entities'),
          ids: normalized.get('result'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.SEND_EMAIL.FAILED)(err)),
    );
};

export const snoozeTask = (comment: string) => (dispatch: Dispatch, getState: any) => {
  const taskId = selectors.getOpenedSnoozingModal(getState());
  const snoozedDate = selectors.getSnoozeSelectedDate(getState());
  dispatch(createAction(actionTypes.SNOOZE_TASK.STARTED)());
  return updateTaskSnoozedTimeApi({ taskId, snoozedDate, comment })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, updateTaskSnoozedTimeSchema);
        return dispatch(createAction(actionTypes.SNOOZE_TASK.COMPLETED)({
          activityId: normalized.getIn(['entities', 'TaskDto', normalized.get('result'), 'activity']),
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.SNOOZE_TASK.FAILED)(err)),
    );
};

export const declineSnoozing = () => (dispatch: Dispatch, getState: any) => {
  const taskId = selectors.getOpenedSnoozingModal(getState());
  const formSelector = formValueSelector('snooze-task-form');
  const comment = formSelector(getState(), 'comment');
  dispatch(createAction(actionTypes.DECLINE_SNOOZE_TASK.STARTED)());
  return updateTaskSnoozedTimeApi({ taskId, comment })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, updateTaskSnoozedTimeSchema);
        return dispatch(createAction(actionTypes.DECLINE_SNOOZE_TASK.COMPLETED)({
          activityId: normalized.getIn(['entities', 'TaskDto', normalized.get('result'), 'activity']),
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.DECLINE_SNOOZE_TASK.FAILED)(err)),
    );
};

export const getAccountCampaigns = (accountFilter: number, taskId: string) => (dispatch: Dispatch, getState: any) => {
  // @ts-expect-error TS2554: Expected 1 arguments, but got 2.
  const accountId = taskId ? selectors.getAccountId(getState(), { itemId: taskId }) : accountFilter;
  dispatch(createAction(actionTypes.GET_ACCOUNT_CAMPAIGNS.STARTED)());
  return getAgencyCampaigns({
    limit: 100,
    page: 0,
    sort: 'campaignName',
    order: 'asc',
    type: 'ALL',
    accountId,
  })
    .then(
      ({ data: { items = [] } }) => dispatch(createAction(actionTypes.GET_ACCOUNT_CAMPAIGNS.COMPLETED)({
        options: items.map((item) => ({
          label: `${item.internalOrderNumber} - ${item.campaignName}`,
          value: item.campaignId,
        })),
      })),
      (err) => dispatch(createAction(actionTypes.GET_ACCOUNT_CAMPAIGNS.FAILED)(err)),
    );
};

export const getLabelValueFinishingCampaigns = (
  args: { filter: string },
  token: CancelToken,
) => (dispatch: Dispatch, getState: any) => {
  const accountId = selectors.getAccountIdForFinishingModal(getState());
  const taskCreationDateFilter = selectors.getFinishingTaskCreationDateFilter(getState()) ?? undefined;
  return getAgencyCampaigns({
    limit: 100,
    page: 0,
    sort: 'campaignName',
    order: 'asc',
    type: 'ALL',
    searchQuery: args.filter,
    accountId,
    orderedAfter: taskCreationDateFilter as unknown as DateType,
  }, token)
    .then(
      ({ data: { items = [] } }) => items.map((item) => ({
        label: `${item.internalOrderNumber} - ${item.campaignName}`,
        value: item.campaignId,
      })),
    );
};

export const getLabelValueAccounts = (
  args: { filter: string },
  token: CancelToken,
) => getAllOwnedAccountsShort({ prefix: args.filter }, token).then(
  ({ data }) => data.items.map((item) => ({
    label: item.displayName,
    value: item.id,
  })),
);

export const getLabelValueAgencyAccounts = (
  args: { filter: string },
  token: CancelToken,
) => getAllOwnedAccountsShort({ prefix: args.filter, role: 'AGENCY' }, token).then(
  ({ data }) => data.items.map((item) => ({
    label: item.displayName,
    value: item.id,
  })),
);

export const getLabelValueBrokerAccounts = (
  args: { filter: string },
  token: CancelToken,
) => getAllOwnedAccountsShort({ prefix: args.filter, role: 'BROKER' }, token).then(
  ({ data }) => data.items.map((item) => ({
    label: item.displayName,
    value: item.id,
  })),
);

export const getLabelValueSources = (args: { filter: string }, token: CancelToken) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.GET_SOURCES.STARTED)());

  return getSources({
    limit: 100,
    page: 0,
    sort: 'name',
    order: 'asc',
    nameFilter: args.filter,
  }, token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getSourcesSchema);
        dispatch(createAction(actionTypes.GET_SOURCES.COMPLETED)({
          entities: normalized.get('entities'),
        }));
        return normalized.getIn(['entities', 'SourceDto'], Map()).toList().map((item: Map<string, string>) => ({
          label: item.get('name'),
          value: item.get('id'),
        })).toJS();
      },
    );
};

export const getTaskTopics = (args: { filter: string }, token: CancelToken) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.GET_TASK_TOPICS.STARTED)());

  return getTaskTopicsApi({
    limit: 100,
    page: 0,
    sort: 'name',
    order: 'asc',
    nameFilter: args.filter,
  }, token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getTaskTopicsSchema);
        dispatch(createAction(actionTypes.GET_TASK_TOPICS.COMPLETED)({
          entities: normalized.get('entities'),
        }));
        return normalized.getIn(['entities', 'TaskTopicDto'], Map()).toList().map((item: Map<string, string>) => ({
          label: item.get('name'),
          value: item.get('id'),
        })).toJS();
      },
    );
};

export const getLabelValueAssignees = (
  args: any,
  token: CancelToken,
) => getSalesPersons({ prefix: args.filter }, token)
  .then(({ data }) => data.map((item) => ({ label: item.name, value: item.id })));

export const getLabelValueTags = (args: { filter: string, type?: TagType }, token: CancelToken) => getTagsApi({
  limit: 100,
  page: 0,
  sort: 'name',
  type: args.type ?? TagType.SALESFUNNEL,
  order: 'asc',
  nameFilter: args.filter,
}, token).then(
  ({ data }) => data.items.map((item) => ({
    label: item.name,
    value: item.id,
  })),
);

export const getLabelValueSalesPersons = (
  args: any,
  token: CancelToken,
) => getSalesPersons({ prefix: args.filter }, token)
  .then(({ data }) => data.map((item) => ({
    label: item.name,
    value: item.id,
  })));

export const openEmailModal = (contactId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.OPEN_EMAIL_MODAL.STARTED)({
    contactId,
    taskId,
  }));
  return getGmailSignature()
    .then(
      ({ data }) => dispatch(createAction(actionTypes.OPEN_EMAIL_MODAL.COMPLETED)({
        contactId,
        taskId,
        signature: data,
      })),
      (err) => dispatch(createAction(actionTypes.OPEN_EMAIL_MODAL.FAILED)(err)),
    );
};

export const handleDateSelect = (date: Moment) => createAction(actionTypes.SELECT_DATE)({
  date: date.format(DATE_ISO).toString(),
});

export const showTaskEditForm = () => createAction(actionTypes.SHOW_TASK_EDIT_FORM)();
export const hideTaskEditForm = () => createAction(actionTypes.HIDE_TASK_EDIT_FORM)();

export const closeEmailModal = () => createAction(actionTypes.CLOSE_EMAIL_MODAL)();

export const openDeleteModal = (id: string) => createAction(actionTypes.OPEN_DELETE_MODAL)({ id });
export const openRestoreArchivedModal = (id: string) => createAction(actionTypes.OPEN_RESTORE_ARCHIVED_MODAL)({ id });

export const openModal = (id: string | undefined) => createAction(actionTypes.OPEN_MODAL)({ id });
export const closeModal = () => createAction(actionTypes.CLOSE_MODAL)();

export const openFinishModal = (id: string) => createAction(actionTypes.OPEN_FINISH_MODAL)({ id });
export const closeFinishModal = () => createAction(actionTypes.CLOSE_FINISH_MODAL)();

export const showWithOfferFinishing = () => createAction(actionTypes.SHOW_WITH_OFFER_FINISHING)();
export const showWithoutOfferFinishing = () => createAction(actionTypes.SHOW_WITHOUT_OFFER_FINISHING)();
export const toggleShowAllCampaign = (isAllShown: boolean) => createAction(actionTypes.TOGGLE_SHOW_ALL_CAMP_ON_FINISH)({
  isAllShown,
});

export const openRestoreModal = (id: boolean) => createAction(actionTypes.OPEN_RESTORE_MODAL)({ id });
export const closeRestoreModal = () => createAction(actionTypes.CLOSE_RESTORE_MODAL)();
export const openSnoozeModal = (id: boolean) => createAction(actionTypes.OPEN_SNOOZE_MODAL)({ id });
export const closeSnoozeModal = () => createAction(actionTypes.CLOSE_SNOOZE_MODAL)();
export const openSourceModal = (id: boolean) => createAction(actionTypes.OPEN_SOURCE_MODAL)({ id });
export const closeSourceModal = () => createAction(actionTypes.CLOSE_SOURCE_MODAL)();

export const setContactType = (type: ContactSourceInline) => createAction(actionTypes.SELECT_CONTACT_TYPE)({ type });

export const updatePriority = (
  source: { value: string } | undefined,
  instance: string,
) => (dispatch: Dispatch, getState: any) => {
  if (source) {
    // @ts-expect-error TS2554: Expected 1 arguments, but got 2.
    const priority = selectors.getPriorityBySourceId(getState(), { itemId: source.value });
    dispatch(change(instance, 'priority', { label: i18n.t(priority), value: priority }));
  }
};

export const getEmailSyncInfo = (token: CancelToken, instance: string) => (dispatch: Dispatch) => {
  dispatch(createAction(actionTypes.GET_SYNC_INFO.STARTED)({
    instance,
  }));
  return getGmailAuthorizeUrl(token)
    .then(
      ({ data }) => dispatch(createAction(actionTypes.GET_SYNC_INFO.COMPLETED)({
        syncInfo: fromJS(data || {}),
      })),
      (err) => dispatch(createAction(actionTypes.GET_SYNC_INFO.FAILED)(err)),
    );
};

export const updateAccountDefaults = (
  source: { value: string } | undefined,
  instance: string,
) => (dispatch: any) => {
  // @ts-expect-error TS2554: Expected 2 arguments, but got 1.
  if (instance === 'tasks-form') dispatch(getAccountCampaigns(!!source && source.value));
  if (source) {
    const accountId = source.value;
    getAccountById({ accountId })
      .then(
        ({ data }) => {
          dispatch(change(instance, 'agencyAccountId', data.defaultAgencyAccountId
            ? { value: data.defaultAgencyAccountId, label: data.defaultAgencyAccountName } : null));
          dispatch(change(instance, 'brokerAccountId', data.defaultBrokerAccountId
            ? { value: data.defaultBrokerAccountId, label: data.defaultBrokerAccountName } : null));
          dispatch(change(instance, 'campaignId', null));
        },
      );
  }
};
