import {
  useCallback, useMemo, useState, ChangeEvent, useContext,
} from 'react';
import { useRequest } from '@adnz/use-request';
import { useTranslation } from 'react-i18next';
import notify from 'src/modules/Notification';
import confirmAlert from 'src/components/confirmAlert';
import { deleteAttachmentsByIds, uploadAttachments } from '@adnz/api-ws-activity';
import uniqBy from 'lodash.uniqby';
import { CampaignToolContext, ActionType } from '../../../context';

interface IAttachment {name: string, content: string}
export interface UseUploadFilesResponse {
  process: (evt: ChangeEvent<HTMLInputElement>) => Promise<void>,
  uploadedFiles: IAttachment[],
  uploadFiles: (activityId: string) => void,
  removeFile: (args: { name: string, id?: string, activityId?: string }) => void,
  deletedFiles: string[]
  deleteAttachmentForever: (activityId: string) => void,
  cleanFilesState: () => void,
  loading: boolean,
}

interface IUseUploadFiles {
  afterUpdate?: () => void
}

type ToBase64 = (file: File) => Promise<string>;

const useUploadFiles = ({ afterUpdate }: IUseUploadFiles): UseUploadFilesResponse => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadFiles] = useState<IAttachment[]>([]);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const { dispatch } = useContext(CampaignToolContext);
  const cleanFilesState = useCallback(() => {
    setUploadFiles([]);
    setDeletedFiles([]);
  }, [setUploadFiles, setDeletedFiles]);
  const onFail = useCallback(
    (error) => { throw error; },
    [],
  );

  const [,, upload] = useRequest({
    apiMethod: uploadAttachments,
    runOnMount: false,
    onSuccess: useCallback((attachment, requestData) => {
      const [, parameters] = requestData;
      const { activityId } = parameters;
      dispatch({
        type: ActionType.AddAttachment,
        payload: {
          activityId,
          attachment,
        },
      });
    }, [dispatch]),
    onFail,
  });

  const [,, deleteAttachment] = useRequest({
    apiMethod: deleteAttachmentsByIds,
    runOnMount: false,
    onSuccess: useCallback((attachment, requestData) => {
      const [deletedFilesArray, parameters] = requestData;
      const { activityId } = parameters;
      dispatch({
        type: ActionType.RemoveAttachment,
        payload: {
          activityId,
          deletedFilesArray,
        },
      });
    }, [dispatch]),
    onFail,
  });

  const deleteAttachmentForever = useCallback((activityId) => {
    setDeletedFiles((filesToDelete) => {
      if (filesToDelete.length) {
        deleteAttachment(filesToDelete, { activityId });
      }
      return [];
    });
  }, [deleteAttachment, setDeletedFiles]);

  const toBase64 = useCallback<ToBase64>(
    (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    }),
    [],
  );

  const convertFileToBase64 = useCallback(async (file: File) => {
    const convertedFile: string = await toBase64(file);
    const cleanedFile = convertedFile.split(',')[1];
    return cleanedFile;
  }, [toBase64]);

  const process = useCallback(async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { target = { value: '' } } = evt || {}; // *1 hack to input to allow download same file again

    if (!evt.target.files) {
      return;
    }
    try {
      setLoading(true);

      const { files } = evt.target;
      const convertedFiles = await Promise.all(
        [...files].map(async (f) => {
          const content = await convertFileToBase64(f);
          if (!content) {
            throw new Error('conversion failed');
          }
          return {
            name: f.name,
            content,
          };
        }),
      );
      setUploadFiles((uplFiles) => uniqBy([...uplFiles, ...convertedFiles], 'name'));

      setLoading(false);
      target.value = ''; // *2 hack to input to allow download same file again
    } catch (e) {
      setLoading(false);
      notify.danger(t('serviceDashboard:ERROR'), t(e.response.data.message));
      target.value = ''; // *3 hack to input to allow download same file again
    }
  }, [setLoading, setUploadFiles, convertFileToBase64, t]);

  const uploadFiles = useCallback(async (activityId: string) => {
    try {
      setLoading(true);
      if (uploadedFiles.length) {
        await upload(uploadedFiles, { activityId });
      }
      afterUpdate?.();
      cleanFilesState();
      setLoading(false);
    } catch (e) {
      notify.danger(t('serviceDashboard:ERROR'), t(e.response.data.message));
      cleanFilesState();
      setLoading(false);
    }
  }, [cleanFilesState, setLoading, upload, uploadedFiles, afterUpdate, t]);

  const removeFile = useCallback(({ name, id }) => {
    confirmAlert({
      title: t('serviceDashboard:WARNING'),
      message: t('serviceDashboard:DELETE_DOCUMENT'),
      buttons: [
        {
          label: t('serviceDashboard:YES_LABEL'),
          onClick: (close) => {
            if (id) {
              setDeletedFiles((files) => [...files, id]);
            } else {
              setUploadFiles((files) => files.filter((f) => f.name !== name));
            }
            close();
          },
        },
      ],
      closeText: t('serviceDashboard:CANCEL'),
    });
  }, [setUploadFiles, setDeletedFiles, t]);

  return useMemo<UseUploadFilesResponse>(
    () => ({
      process, uploadedFiles, uploadFiles, removeFile, loading, cleanFilesState, deletedFiles, deleteAttachmentForever,
    }),
    [process, uploadedFiles, uploadFiles, removeFile, loading, cleanFilesState, deletedFiles, deleteAttachmentForever],
  );
};

export default useUploadFiles;
