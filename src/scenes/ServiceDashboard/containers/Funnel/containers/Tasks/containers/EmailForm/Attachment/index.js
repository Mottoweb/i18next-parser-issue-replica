import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icons } from '@adnz/ui';
import * as selectors from '../selectors';
import * as actions from '../actions';

const Attachment = ({
  file,
}) => {
  const uploadingFileId = useSelector(selectors.getUploadingFileName);
  const fileIsRemoving = useSelector(selectors.fileIsRemoving);
  const dispatch = useDispatch();
  const removeAttachment = React.useCallback(
    () => dispatch(actions.removeAttachment(file.fileName)),
    [dispatch, file],
  );

  return (
    <tr>
      <td>
        {`${file.fileName} (${Math.round(file.size / 1024)} kB) `}
      </td>
      <td>
        <Button
          isLoading={uploadingFileId === file.fileName || fileIsRemoving}
          disabled={uploadingFileId === file.fileName || fileIsRemoving}
          onClick={removeAttachment}
          icon
        >
          <Icons.Trash />
        </Button>
      </td>
    </tr>
  );
};

Attachment.propTypes = {
  file: PropTypes.objectOf({
    filename: PropTypes.string,
    size: PropTypes.string,
    uniqueIdentifier: PropTypes.string,
  }).isRequired,
};

export default Attachment;
