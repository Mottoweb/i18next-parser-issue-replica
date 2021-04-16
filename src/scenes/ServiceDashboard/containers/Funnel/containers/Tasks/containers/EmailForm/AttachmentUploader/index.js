import React from 'react';
import PropTypes from 'prop-types';
import { useResumableSimple } from 'src/hooks/useResumable';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icons } from '@adnz/ui';
import * as actions from '../actions';
import * as selectors from '../selectors';

const UploadAttachment = ({
  target,
  query,
  headers,
}) => {
  const isDisabledUploadButton = useSelector(selectors.isDisabledUploadButton);
  const isUploading = useSelector(selectors.isUploading);
  const dispatch = useDispatch();
  const config = React.useMemo(
    () => ({ target, query, headers }),
    [target, query, headers],
  );
  const handlers = React.useMemo(
    () => ({
      handleFileAdded: (file) => dispatch(actions.onFileAdded(file)),
      handleFileProgress: (progress) => dispatch(actions.handleProgress(progress)),
      handleError: () => dispatch(actions.handleError()),
      handleComplete: () => dispatch(actions.handleComplete()),
    }),
    [dispatch],
  );
  const [ref] = useResumableSimple(config, handlers);

  return (
    <>
      <Button
        disabled={isDisabledUploadButton || isUploading}
        icon
      >
        <Icons.Paperclip ref={ref} size={22} />
      </Button>
    </>
  );
};

UploadAttachment.propTypes = {
  target: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  query: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  headers: PropTypes.object.isRequired,
};

export default UploadAttachment;
