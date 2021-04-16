import { CancelToken } from 'axios';
import {
  createAction,
} from 'redux-actions';
import axios from 'axios';
import {
  List,
  Map,
} from 'immutable';
import {
  getAccountEmailsSchema, getAccountEmails, getAttachmentBody, getAttachmentBodySchema,
} from '@adnz/api-ws-email-sync';

import {
  TagType, createTask as createTaskApi,
  createTaskSchema, getSalesPersons, getSources, getSourcesSchema,
  getTags as getTagsApi, getTagsSchema,
  getTaskTopics,
  TaskTopicDto,
  PaginatedTaskTopics,
} from '@adnz/api-ws-funnel';
import {
  getAllOwnedAccountsShort, getAllOwnedAccountsShortSchema, getDetailedAccount, getDetailedAccountSchema,
} from '@adnz/api-ws-salesforce';
import {
  deleteActivity as deleteActivityApi, deleteActivitySchema, getFunnelTouchpoints, getFunnelTouchpointsSchema,
} from '@adnz/api-ws-activity';
import {
  handleFormErrors,
} from 'src/helpers';
import i18n from 'src/i18n';
import {
  change,
} from 'redux-form/immutable';
import legacyNormalize from 'src/utils/legacyNormalize';
import * as actionTypes from './actionTypes';

export const getEmails = (args: any, instance: string) => (dispatch: any) => {
  dispatch(createAction(actionTypes.GET_ACCOUNT_EMAILS.STARTED)({
    instance,
  }));
  return getAccountEmails(args.filters.emailFilter,
    {
      ...args.filters,
      accountAppId: args.filters.accountId,
      limit: args.limit,
      page: args.page,
      sort: args.sort,
      order: args.order,
    }, args.token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getAccountEmailsSchema);
        return dispatch(createAction(actionTypes.GET_ACCOUNT_EMAILS.COMPLETED)({
          total: normalized.getIn(['result', 'total'], 0),
          ids: normalized.getIn(['result', 'items'], List()),
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.GET_ACCOUNT_EMAILS.FAILED)(err)),
    );
};

export const getActivities = (args: any) => (dispatch: any) => {
  dispatch(createAction(actionTypes.GET_ACCOUNT_ACTIVITIES.STARTED)());
  return getFunnelTouchpoints({
    ...args.filters,
    limit: args.limit,
    page: 0,
    sort: args.sort,
    order: args.order,
  })
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getFunnelTouchpointsSchema);
        return dispatch(createAction(actionTypes.GET_ACCOUNT_ACTIVITIES.COMPLETED)({
          total: normalized.getIn(['result', 'total'], 0),
          ids: normalized.getIn(['result', 'items'], List()),
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.GET_ACCOUNT_ACTIVITIES.FAILED)(err)),
    );
};

export const deleteActivity = (activityId: string) => async (dispatch: any) => {
  try {
    dispatch(createAction(actionTypes.DELETE_ACTIVITY.STARTED)({
      result: Map(),
      activityId,
    }));
    const { data } = await deleteActivityApi({ id: activityId });
    const normalized = legacyNormalize(data, deleteActivitySchema);
    dispatch(createAction(actionTypes.DELETE_ACTIVITY.COMPLETED)({
      entities: normalized.get('entities'),
      result: normalized.get('result'),
      activityId,
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const reducedErr = Object.assign(err, { activityId });
      dispatch(createAction(actionTypes.DELETE_ACTIVITY.FAILED)(reducedErr));
    }
  }
};

export const getAttachment = (token: CancelToken, id: string) => (dispatch: any) => {
  dispatch(createAction(actionTypes.GET_ATTACHMENT.STARTED)({
    id,
  }));
  return getAttachmentBody({ id }, token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getAttachmentBodySchema);
        return dispatch(createAction(actionTypes.GET_ATTACHMENT.COMPLETED)({
          entities: normalized.get('entities'),
          data,
          id,
        }));
      },
      (err) => dispatch(createAction(actionTypes.GET_ATTACHMENT.FAILED)(err)),
    );
};

export const getAccountDetails = (token: CancelToken, accountId: string) => (dispatch: any) => {
  dispatch(createAction(actionTypes.GET_DETAILED_ACCOUNT.STARTED)({
    accountId,
  }));
  return getDetailedAccount({ accountId }, token)
    .then(
      ({ data }) => {
        const normalized = legacyNormalize(data, getDetailedAccountSchema);
        return dispatch(createAction(actionTypes.GET_DETAILED_ACCOUNT.COMPLETED)({
          entities: normalized.get('entities'),
        }));
      },
      (err) => dispatch(createAction(actionTypes.GET_DETAILED_ACCOUNT.FAILED)(err)),
    );
};

export const createTask = (args: any) => async (dispatch: any) => {
  try {
    dispatch(createAction(actionTypes.CREATE_TASK.STARTED)({
      result: Map(),
    }));
    const { data } = await createTaskApi(args);
    const normalized = legacyNormalize(data, createTaskSchema);
    dispatch(createAction(actionTypes.CREATE_TASK.COMPLETED)({
      instance: normalized.get('entities') && normalized.getIn(['entities', 'TaskDto', normalized.get('result'), 'status']),
    }));
  } catch (err) {
    if (!axios.isCancel(err)) {
      dispatch(createAction(actionTypes.CREATE_TASK.FAILED)(err));
      handleFormErrors(err);
    }
  }
}

export const getLabelValueAgencyAccounts = (args: any, token: CancelToken) => getAllOwnedAccountsShort(
  { prefix: args.filter, role: 'AGENCY' },
  token,
)
  .then(
    ({ data }) => {
      const normalized = legacyNormalize(data, getAllOwnedAccountsShortSchema);
      return normalized.getIn(['entities', 'AccountShort'], Map()).toList().map((item: any) => ({
        label: item.get('displayName'),
        value: item.get('id'),
      })).toJS();
    },
  );

export const getLabelValueBrokerAccounts = (args: any, token: CancelToken) => getAllOwnedAccountsShort(
  { prefix: args.filter, role: 'BROKER' },
  token,
)
  .then(
    ({ data }) => {
      const normalized = legacyNormalize(data, getAllOwnedAccountsShortSchema);
      return normalized.getIn(['entities', 'AccountShort'], Map()).toList().map((item: any) => ({
        label: item.get('displayName'),
        value: item.get('id'),
      })).toJS();
    },
  );

export const getLabelValueTags = (args: any, token: CancelToken) => getTagsApi({
  limit: 100,
  page: 0,
  sort: 'name',
  type: TagType.SALESFUNNEL,
  order: 'asc',
  nameFilter: args.filter,
}, token)
  .then(
    ({ data }) => {
      const normalized = legacyNormalize(data, getTagsSchema);
      return normalized.getIn(['entities', 'TagDto'], Map()).toList().map((item: any) => ({
        label: item.get('name'),
        value: item.get('id'),
      })).toJS();
    },
  );

export const getLabelValueSalesPersons = (
  args: any,
  token: CancelToken,
) => getSalesPersons({ prefix: args.filter }, token)
  .then(
    ({ data }) => data.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  );

export const getLabelValueTaskTopics = (
  args: any,
  token: CancelToken,
) => getTaskTopics({
  limit: 100,
  page: 0,
  sort: 'name',
  order: 'asc',
  nameFilter: args.filter,
}, token)
  .then(
    ({ data }: { data: PaginatedTaskTopics }) => data.items.map((item : TaskTopicDto) => ({
      label: item.name,
      value: item.id,
    })),
  );

export const getLabelValueSources = (args: any, token: CancelToken) => getSources({
  limit: 100,
  page: 0,
  sort: 'name',
  order: 'asc',
  nameFilter: args.filter,
}, token)
  .then(
    ({ data }) => {
      const normalized = legacyNormalize(data, getSourcesSchema);
      return normalized.getIn(['entities', 'SourceDto'], Map()).toList().map((item: any) => ({
        label: item.get('name'),
        value: { id: item.get('id'), priority: item.get('priority') },
      })).toJS();
    },
  );

export const updatePriority = (source: any, instance: string) => (dispatch: any) => {
  if (source) {
    dispatch(change(instance, 'priority', source.value
      ? { label: i18n.t(source.value.priority), value: source.value.priority }
      : { label: i18n.t('serviceDashboard:LOW'), value: 'LOW' }));
  }
};

export const openEmailModal = (EmailId: string) => createAction(actionTypes.OPEN_EMAIL_MODAL)({ EmailId });
export const openCreateTaskModal = () => createAction(actionTypes.OPEN_CREATE_TASK_MODAL)();
export const toggleContactState = (contact: any) => createAction(actionTypes.TOGGLE_CONTACT_STATE)({ contact });

export const openActivityEditForm = (activityId: string) => createAction(actionTypes.OPEN_ACTIVITY_EDIT_FORM)({
  activityId,
});
export const closeActivityEditForm = () => createAction(actionTypes.CLOSE_ACTIVITY_EDIT_FORM)();

export const closeModal = () => createAction(actionTypes.CLOSE_MODAL)();
