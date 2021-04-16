import { toObjectWithId } from 'src/helpers';

export const handleTaskEditFormData = (data) => {
  const formData = {
    account: toObjectWithId(data.get('accountId')),
    agencyAccount: toObjectWithId(data.get('agencyAccountId')),
    brokerAccount: toObjectWithId(data.get('brokerAccountId')),
    campaign: data.get('campaignId') ? { campaignId: data.get('campaignId').value } : null,
    leadSource: toObjectWithId(data.get('leadSource')),
    taskTopic: toObjectWithId(data.get('taskTopic')),
    assignee: toObjectWithId(data.get('assignee')),
    priority: data.get('priority').value,
    activity: { message: data.get('message') },
    isImportant: data.get('isImportant'),
    tags: data.get('tags') ? data.get('tags').map((tag) => ({
      // eslint-disable-next-line no-restricted-globals
      id: isNaN(tag.value) ? null : tag.value,
      name: tag.label,
    })) : [],
  };
  return formData;
};
