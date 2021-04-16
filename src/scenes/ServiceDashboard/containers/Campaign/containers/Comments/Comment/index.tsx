import React from 'react';
import { ActivityDto, fromDateTime } from '@adnz/api-ws-activity';
import {
  Icons, Section, Button, ButtonGroup,
} from '@adnz/ui';
import Linkify from 'react-linkify';
import DateTime from 'src/components/DateTime';
import { useTranslation } from 'react-i18next';
import Colors from 'src/theme/Colors';
import Attachments from './Attachments';
import { CommentTitle, CommentInfo, CommentBody } from './styles';

export interface CommentProps {
  onEditClick?: () => void,
  onRemoveClick?: () => void,
  activity: ActivityDto,
}

const Comment: React.FC<CommentProps> = ({
  activity,
  onRemoveClick,
  onEditClick,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <Section data-testid="comments-box-container">
      <CommentTitle>
        <div>
          <b>{activity.creatorName}</b>
          {activity.privateAccess && <Icons.Locked size={14} css="margin-left: 3px;" />}
          {activity.emails && (
          <div css={`font-size: 12px; color: ${Colors['brown-grey-two']};`}>
            {t('serviceDashboard:MAIL_RECIPIENTS')}
            {': '}
            {activity.emails.map((email) => email).join(', ')}
          </div>
          )}
        </div>
        <CommentInfo>
          {activity.creationDate && (
          <DateTime value={fromDateTime(activity.creationDate)} showLocal />
          )}
        </CommentInfo>
      </CommentTitle>
      <CommentBody>
        <div
          data-tesid="comment-text"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          <Linkify properties={{ target: '_blank' }}>{activity.message}</Linkify>
        </div>
        {activity.edited && (
        <ButtonGroup>
          <Button
            data-testid="edit-comment-attachment-button"
            onClick={onEditClick}
            icon
          >
            <Icons.EditAlt size={28} />
          </Button>
          <Button
            onClick={onRemoveClick}
            icon
          >
            <Icons.Trash size={22} />
          </Button>
        </ButtonGroup>
        )}
      </CommentBody>
      {!!activity.attachments?.length && (
      <Attachments
        attachments={activity.attachments}
      />
      )}
    </Section>
  );
};

export default Comment;
