import React, { useState, useContext, useMemo } from 'react';
import { useRequest } from '@adnz/use-request';
import { Button } from '@adnz/ui';
import {
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import notify from 'src/modules/Notification';
import SectionTitle from 'src/components/SectionTitle';
import {
  EntityType, deleteActivity as deleteActivityApi, getActivities, getCampaignActivityMailReceivers,
} from '@adnz/api-ws-activity';
import { useIdentityRoles } from '@adnz/use-auth';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { CampaignToolContext, ActionType } from '../../context';

const Comments: React.FC<{ limit?: number, campaignId: string }> = ({
  limit = 5,
  campaignId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [show, setShow] = useState<boolean>(false);
  const { state: { activities, editActivityId }, dispatch } = useContext(CampaignToolContext);
  const { BOOK_CAMPAIGNS } = useIdentityRoles();

  useRequest({
    apiMethod: getActivities,
    parameters: [{
      entityId: campaignId, entityType: EntityType.CAMPAIGN, sort: 'creationDate', order: 'DESC',
    }],
    onSuccess: (data) => {
      dispatch({ type: ActionType.SaveActivities, payload: data.items });
    },
  });

  const [,, deleteActivity] = useRequest({
    apiMethod: deleteActivityApi,
    runOnMount: false,
    onSuccess: React.useCallback(
      (data) => {
        dispatch({ type: ActionType.DeleteActivity, payload: { id: data.id } });
        notify.success(t('serviceDashboard:SUCCESS'), t('serviceDashboard:ACTIVITY_WAS_DELETED'));
      },
      [dispatch, t],
    ),
    onFail: React.useCallback(
      (data) => {
        notify.danger(t('serviceDashboard:ERROR'), t(data.message));
      },
      [t],
    ),
  });

  const [emails] = useRequest({
    apiMethod: getCampaignActivityMailReceivers,
    defaultData: [],
    parameters: [{
      campaignId, isPublic: !BOOK_CAMPAIGNS,
    }],
  });
  const initialValues = useMemo(() => ({
    entityType: EntityType.CAMPAIGN,
    message: '',
    entityId: campaignId,
    privateAccess: BOOK_CAMPAIGNS,
    emails,
    tags: [],
    id: '',
    attachments: [],
  }), [campaignId, emails, BOOK_CAMPAIGNS]);
  return (
    <>
      <SectionTitle>{t('serviceDashboard:COMMENTS')}</SectionTitle>
      <Row>
        <Col md={12}>
          <CommentForm
            initialValues={initialValues}
          />
          <div>
            <>
              {activities.slice(0, show ? activities.length : limit).map((activity) => (
                activity.id === editActivityId
                  ? (
                    <CommentForm
                      key={activity.id}
                      edit
                      initialValues={activity}
                      onCloseClick={() => dispatch({
                        type: ActionType.SetActivityEditable,
                        payload: { id: undefined },
                      })}
                      afterUpdate={() => dispatch({
                        type: ActionType.SetActivityEditable,
                        payload: { id: undefined },
                      })}
                    />
                  )
                  : (
                    <Comment
                      key={activity.id}
                      activity={activity}
                      onEditClick={() => (
                        dispatch({ type: ActionType.SetActivityEditable, payload: { id: activity.id } })
                      )}
                      onRemoveClick={() => { deleteActivity({ id: activity.id ?? '' }); }}
                    />
                  )
              ))}
            </>
            {activities.length > limit && (
              <div css="display: flex;justify-content: flex-end;margin-top: 15px;">
                <Button
                  theme="create-secondary"
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? t('serviceDashboard:SHOW_LESS') : t('serviceDashboard:SHOW_MORE')}
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Comments;
