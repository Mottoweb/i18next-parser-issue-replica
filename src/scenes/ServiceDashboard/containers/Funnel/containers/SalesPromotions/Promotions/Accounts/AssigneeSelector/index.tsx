import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '@adnz/use-request';
import {
  assignTask, getSalesPersons, UserShort, TaskDto,
} from '@adnz/api-ws-funnel';
import notify from 'src/modules/Notification';
import { Option } from 'src/types';
import { StyledAsyncSelect } from '@adnz/ui';
import * as actions from '../../../actions';
import { useDispatch } from '../../../context';

const AssigneeSelector: React.FC<{ task: TaskDto, salesPromotionId: string, accountId: string }> = ({
  task,
  salesPromotionId,
  accountId,
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  const [,, assign] = useRequest({
    apiMethod: assignTask,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (data) => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_CLONED'));
        dispatch(actions.SAVE_PROMOTION_TASK({ task: data, salesPromotionId, accountId }));
      },
      [accountId, dispatch, t, salesPromotionId],
    ),
  });

  const onChange = React.useCallback(
    ({ value }) => assign({ taskId: task.id ?? '', assigneeId: value }),
    [assign, task],
  );

  const [, , getSales] = useRequest({
    apiMethod: getSalesPersons,
    runOnMount: false,
  });

  const handleLoadOptions = React.useCallback(
    async (): Promise<Option<string>[]> => {
      const items = await getSales({ prefix: '' });

      return items.map((item: UserShort) => ({
        value: item.id,
        label: item.name ?? '',
      }));
    },
    [getSales],
  );

  return (
    <StyledAsyncSelect<Option<string>, false>
      id="assign-select"
      placeholder={t('serviceDashboard:SELECT_ASSIGNEE')}
      onChange={onChange}
      isClearable
      defaultOptions
      loadOptions={handleLoadOptions}
      styles={{ option: (base: Record<string, unknown>) => ({ ...base, wordBreak: 'break-all' }) }}
      value={task.assignee?.name ? { value: task.assignee.id, label: task.assignee.name } : null}
    />
  );
};

export default AssigneeSelector;
