import React from 'react';
import {
  Button, ButtonGroup, Table, Icons,
} from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import { AttachmentDto, downloadAttachmentById } from '@adnz/api-ws-activity';
import { useRequest } from '@adnz/use-request';
import base64toArrayBuffer from 'base64-arraybuffer';
import fileSaver from 'file-saver';
import Colors from 'src/theme/Colors';

const ATTACHMENTS_LIMIT = 5;

interface IAttach {
  attachments: AttachmentDto[]
}

const Attachments: React.FC<IAttach> = ({
  attachments,
}) => {
  const [attachmentsLimit, setAttachmentsLimit] = React.useState<number>(ATTACHMENTS_LIMIT);
  const [, setName] = React.useState<string>('');
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const switchShow = React.useCallback(() => {
    setAttachmentsLimit(() => (attachments.length > attachmentsLimit ? attachments.length : ATTACHMENTS_LIMIT));
  }, [attachments, attachmentsLimit, setAttachmentsLimit]);

  const [,, download] = useRequest({
    apiMethod: downloadAttachmentById,
    runOnMount: false,
    onSuccess: React.useCallback(
      ({ content }) => {
        setName((fileName) => {
          const blob = new Blob([base64toArrayBuffer.decode(content)]);
          fileSaver.saveAs(blob, fileName);
          return '';
        });
      },
      [setName],
    ),
    onFail: React.useCallback(
      (error) => { throw error; }, [],
    ),
  });

  const downloadThisAttachment = React.useCallback(
    ({ name, id }) => {
      setName(name);
      download({ attachmentId: id });
    }, [download, setName],
  );

  return (
    <>
      <Table css="margin-top: 10px;">
        <tbody>
          <>
            {attachments.slice(0, attachmentsLimit).map((a, index) => (
              <Table.Tr key={a.name} rowIndex={index}>
                <Table.Td>
                  {a.name}
                </Table.Td>
                <Table.Td css="width: 1px;" type="action">
                  <Button onClick={() => downloadThisAttachment(a)} icon>
                    <Icons.Download color={Colors.Tuna} />
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </>
        </tbody>
      </Table>
      {attachments.length > ATTACHMENTS_LIMIT && (
        <ButtonGroup spacer="top" align="right">
          <Button
            data-testid="show-hide-attachments-button"
            theme="create-secondary"
            onClick={switchShow}
          >
            {t(attachments.length > attachmentsLimit ? 'SHOW_MORE' : 'SHOW_LESS')}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
};

export default Attachments;
