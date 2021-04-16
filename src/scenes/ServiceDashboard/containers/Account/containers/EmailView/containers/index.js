import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@adnz/ui';
import useEffectWithToken from 'src/hooks/useEffectWithToken';
import * as selectors from '../../../selectors';
import * as actions from '../../../actions';

const Attachment = ({
  itemId,
}) => {
  const attach = useSelector((state) => selectors.getAttachment(state, { itemId }));
  const isLoading = useSelector((state) => selectors.isLoadingAttachment(state, { itemId }));
  const dispatch = useDispatch();
  const download = useEffectWithToken(
    (token) => dispatch(actions.getAttachment(token, itemId)),
    [dispatch, itemId],
  );
  return (
    <Button
      onClick={download}
      disabled={isLoading}
      isLoading={isLoading}
      css="text-overflow: ellipsis; max-width: 100%; overflow-x: hidden;"
    >
      <span>
        {attach.get('fileName')}
      </span>
    </Button>
  );
};

Attachment.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default Attachment;
