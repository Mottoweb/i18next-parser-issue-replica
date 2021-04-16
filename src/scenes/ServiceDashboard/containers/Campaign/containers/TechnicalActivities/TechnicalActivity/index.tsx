import React from 'react';
import { useTranslation } from 'react-i18next';
import DateTime from 'src/components/DateTime';
import { ActivityDto, fromDateTime } from '@adnz/api-ws-activity';
import ActivityItem from 'src/components/ActivityItem';

interface TechnicalCommentProps {
  activity: ActivityDto,
}

const TechnicalComment:React.FC<TechnicalCommentProps> = ({
  activity: {
    message,
    emails,
    campaignPositionNames,
    status,
    creatorName,
    activityType,
    creationDate,
  },
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const htmlMessage = t(message, {
    interpolation: { escapeValue: false },
    emails: emails && emails.join(', '),
    campaignPositions: campaignPositionNames && (
      campaignPositionNames.map((name: string) => `<li>${name}</li>`).join('')
    ),
    status: status && t(status),
    creator: creatorName,
  });

  return (
    <ActivityItem
      type={activityType ? t(activityType) : undefined}
      icon={activityType}
      date={(
        <>
          {creationDate && <DateTime value={fromDateTime(creationDate)} showLocal />}
        </>
      )}
      message={(
        <div
          dangerouslySetInnerHTML={{ __html: htmlMessage }} // eslint-disable-line react/no-danger
        />
      )}
    />
  );
};

export default TechnicalComment;
