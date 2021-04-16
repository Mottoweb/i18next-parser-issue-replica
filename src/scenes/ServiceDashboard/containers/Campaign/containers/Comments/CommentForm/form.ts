import { ActivityKeyValueDto } from '@adnz/api-ws-activity';

export interface FormValues {
  emails?: string[]
  message: string
  privateAccess?: boolean
  notifySales?: boolean
  campaignPositionIds?: string[]
  keyValues?: ActivityKeyValueDto[]
}
