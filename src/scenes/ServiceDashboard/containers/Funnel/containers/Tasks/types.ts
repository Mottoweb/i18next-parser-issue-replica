import { TagDto, TaskDtoPriorityInline } from '@adnz/api-ws-funnel';

export type TaskForm = {
  account?: { id: string }
  assignee?: { id: string }
  leadSource?: { id: string }
  taskTopic?: { id: string }
  agencyAccount?: { id: string }
  brokerAccount?: { id: string }
  priority: TaskDtoPriorityInline
  activity: { message: string }
  tags: TagDto[]
  isImportant: boolean
};
