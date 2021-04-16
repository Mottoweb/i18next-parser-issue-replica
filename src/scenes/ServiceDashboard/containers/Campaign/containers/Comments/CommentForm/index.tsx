import React, { useContext } from 'react';
import { Field, Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useRequest } from '@adnz/use-request';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import notify from 'src/modules/Notification';
import SwitchField from 'src/components/form/fields/SwitchField';
import {
  Label,
  Button,
  ButtonGroup,
  Tooltip,
  Table,
  Icons,
  Section,
} from '@adnz/ui';
import TextareaField from 'src/components/form/fields/TextareaField';
import CreatableSelectField from 'src/components/form/fields/CreatableSelectField';
import {
  createActivity as createActivityApi, getCampaignActivityMailReceivers,
  EntityType, ActivityForm, ActivityDto, updateActivity as updateActivityApi,
} from '@adnz/api-ws-activity';

import { OnChange } from 'react-final-form-listeners';
import { ActionType, CampaignToolContext } from '../../../context';
import { FormValues } from './form';
import useUploadFiles from '../hooks/useUploadFiles';
import {
  ControlsWrapper,
  HiddenInput,
} from './styles';

export interface CommentFormProps {
  edit?: boolean,
  onCloseClick?: () => void,
  initialValues: ActivityDto,
  afterUpdate?: () => void,
  afterCreate?: () => void,
  campaignId?: string,
}

const CommentForm: React.FC<CommentFormProps> = ({
  edit = false,
  initialValues,
  onCloseClick = () => {},
  afterUpdate = undefined,
  afterCreate = undefined,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const { campaignId } = useParams<{ campaignId: string }>();
  const { dispatch } = useContext(CampaignToolContext);
  const {
    process, uploadedFiles, uploadFiles, removeFile, loading, cleanFilesState, deletedFiles, deleteAttachmentForever,
  } = useUploadFiles({});
  const [, { pending: isCreating }, createActivity] = useRequest({
    apiMethod: createActivityApi,
    runOnMount: false,
    onSuccess: React.useCallback(
      (data) => {
        dispatch({ type: ActionType.AddActivity, payload: data });
        notify.success('', t('serviceDashboard:ACTIVITY_WAS_CREATED'));
        cleanFilesState();
        afterCreate?.();
      },
      [dispatch, t, afterCreate, cleanFilesState],
    ),
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
  });

  const [, { pending: isRequestingEmails }, getEmails] = useRequest({
    apiMethod: getCampaignActivityMailReceivers,
    parameters: [{ campaignId, isPublic: false }],
    runOnMount: false,
  });

  const [, { pending: isUpdating }, updateActivity] = useRequest({
    apiMethod: updateActivityApi,
    runOnMount: false,
    onSuccess: React.useCallback(
      (data) => {
        deleteAttachmentForever(data.id);
        dispatch({ type: ActionType.UpdateActivity, payload: data });
        notify.success('', t('serviceDashboard:ACTIVITY_WAS_UPDATED'));
        uploadFiles(data.id);
        afterUpdate?.();
      },
      [dispatch, t, afterUpdate, uploadFiles, deleteAttachmentForever],
    ),
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
  });

  const existAttachments = React.useMemo(() => {
    if (initialValues.attachments?.length) {
      return initialValues.attachments.filter((a) => !deletedFiles.some((f) => f === a.id));
    }
    return [];
  }, [deletedFiles, initialValues]);

  return (
    <Section isForm>
      <Form<FormValues>
        initialValues={initialValues}
        onSubmit={(values) => (edit
          ? updateActivity({
            ...values,
            entityType: EntityType.CAMPAIGN,
            entityId: campaignId,
            tags: [],
            attachments: [],
            notifySales: !!values.notifySales,
          } as ActivityForm, { activityId: initialValues.id })
          : createActivity({
            ...values,
            entityType: EntityType.CAMPAIGN,
            entityId: campaignId,
            tags: [],
            attachments: uploadedFiles,
            notifySales: false,
            campaignPositionIds: [],
            keyValues: [],
          } as ActivityForm))}
      >
        {
            ({ handleSubmit, values, form }) => (
              <div>
                {edit ? null : (
                  <div>
                    <Label>{t('serviceDashboard:RECIPIENTS')}</Label>
                    <Field<{ label: string, value: string }[]>
                      id="comment-recipients-email"
                      name="emails"
                      parse={(opts) => opts && opts.map((o:{ label: string, value: string }) => o.value)}
                      format={(opts) => opts && opts.map((o) => ({ value: o, label: o }))}
                      render={(props) => <CreatableSelectField isMulti isClearable {...props} />}
                    />
                  </div>
                )}
                <Label css="margin-top: 10px;" required>{t('serviceDashboard:MESSAGE')}</Label>
                <Field
                  name="message"
                  render={
                    (props) => (
                      <TextareaField
                        placeholder={t('serviceDashboard:COMMENT_NEW_PLACEHOLDER')}
                        rows={4}
                        {...props}
                      />
                    )
                  }
                />
                {!!uploadedFiles?.length && (
                  <Table css="margin-top: 10px;">
                    <tbody>
                      {uploadedFiles.map((file, index) => (
                        <Table.Tr key={file.name} rowIndex={index}>
                          <Table.Td>
                            {file.name}
                          </Table.Td>
                          <Table.Td css="width: 1px;" type="action">
                            <Table.ActionsList rowIndex={index}>
                              <Table.ActionsListItem
                                onClick={() => removeFile({ name: file.name })}
                                remove
                                icon={(<Icons.Trash />)}
                              >
                                <div>{t('serviceDashboard:DELETE')}</div>
                              </Table.ActionsListItem>
                            </Table.ActionsList>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                {edit && !!existAttachments.length && (
                  <Table css="margin-top: 10px;">
                    <tbody>
                      {existAttachments.map((attachedFile, index) => (
                        <Table.Tr key={attachedFile.name} rowIndex={index}>
                          <Table.Td>
                            {attachedFile.name}
                          </Table.Td>
                          <Table.Td css="width: 1px;" type="action">
                            <Table.ActionsList rowIndex={index}>
                              <Table.ActionsListItem
                                onClick={() => removeFile({
                                  name: attachedFile.name,
                                  id: attachedFile.id,
                                  activityId: initialValues.id,
                                })}
                                remove
                                icon={(<Icons.Trash />)}
                              >
                                <div>{t('serviceDashboard:DELETE')}</div>
                              </Table.ActionsListItem>
                            </Table.ActionsList>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <ControlsWrapper>
                  <PrivateRoute
                    roles={Roles.BOOK_CAMPAIGNS}
                    render={() => (
                      <Label id="internal-external-activity" css="margin-bottom: 0;">
                        <Field
                          name="privateAccess"
                          type="checkbox"
                          render={(props) => <SwitchField css="margin-right: 10px" {...props} />}
                        />
                        {values.privateAccess ? t('serviceDashboard:INTERNAL_ACTIVITY') : t('serviceDashboard:EXTERNAL_ACTIVITY')}
                        <OnChange name="privateAccess">
                          {
                            (value) => {
                              getEmails({ campaignId, isPublic: !value })
                                .then((data) => form.change('emails', data));
                            }
                          }
                        </OnChange>
                      </Label>
                    )}
                  />
                  <ButtonGroup>
                    <Tooltip
                      tooltip={t('serviceDashboard:UPLOAD_FILES')}
                      placement="top"
                    >
                      <Button
                        css="overflow: hidden;"
                        theme="create-secondary"
                        isLoading={loading}
                        disabled={loading}
                        square
                        dataTestId="add-attachment-to-comment-button"
                      >
                        <Icons.Paperclip color="#fff" size={18} />
                        <HiddenInput
                          accept="image/*|media_type"
                          id="comments-attachment"
                          onChange={process}
                          type="file"
                          multiple
                        />
                      </Button>
                    </Tooltip>
                    {
                      edit && (
                        <Button onClick={onCloseClick} theme="create-secondary">
                          {t('serviceDashboard:BUTTON_CLOSE')}
                        </Button>
                      )
                    }
                    <Button
                      onClick={async () => {
                        await handleSubmit();
                        form.reset();
                      }}
                      isLoading={isCreating || isUpdating || isRequestingEmails}
                      disabled={isCreating || isUpdating || isRequestingEmails}
                    >
                      {t(edit ? 'UPDATE' : 'CREATE')}
                    </Button>
                  </ButtonGroup>
                </ControlsWrapper>
              </div>
            )
          }
      </Form>
    </Section>
  );
};

export default CommentForm;
