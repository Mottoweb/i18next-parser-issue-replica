import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icons } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import Linkify from 'react-linkify';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DateTime from 'src/components/DateTime';
import { fromDateTimeType } from '@adnz/api-helpers';
import { CommentTitle, CommentInfo, CommentBody } from './styles';

const LastComment = ({
  activity,
  activitiesCount,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <Tooltip
      trigger={['hover', 'focus']}
      placement="top"
      type="popper"
      css="vertical-align: bottom;"
      tooltip={activity
        ? (
          <div>
            <CommentTitle>
              <div>
                <span>{t(activity.get('creatorName'))}</span>
                <br />
                <span>
                  {' '}
                  (
                  {t(activity.get('activityType'))}
                  )
                </span>
              </div>
              <CommentInfo>
                <DateTime value={fromDateTimeType(activity.get('creationDate'))} showLocal />
              </CommentInfo>
            </CommentTitle>
            <CommentBody>
              <Linkify properties={{ target: '_blank' }}>{activity.get('message')}</Linkify>
            </CommentBody>
          </div>
        )
        : t('serviceDashboard:NO_ACTIVITIES')}
      children={(
        <>
          <Icons.WarningCircleAlt size={16} css="margin-right: 5px;" />
          <span>
            {activitiesCount}
          </span>
        </>
      )}
    />
  );
};

LastComment.propTypes = {
  activity: ImmutablePropTypes.map,
  activitiesCount: PropTypes.number.isRequired,
};

LastComment.defaultProps = {
  activity: null,
};

export default LastComment;
