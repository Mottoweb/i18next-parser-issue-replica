import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import useMarkdown from 'src/hooks/useMarkdown';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import { MarkdownWrapper } from '../../styles';

const DescriptionModal = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const isModalOpened = useSelector(selectors.isDescriptionModalOpened);
  const description = useSelector(selectors.getDescriptionForModal);
  const html = useMarkdown(description);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  if (!isModalOpened) {
    return null;
  }
  return (
    <Modal
      isOpen
      onRequestClose={closeModal}
      title={t('serviceDashboard:DESCRIPTION')}
    >
      <Modal.Body>
        {/* eslint-disable-next-line react/no-danger */}
        <MarkdownWrapper dangerouslySetInnerHTML={{ __html: html }} />
      </Modal.Body>
    </Modal>
  );
};

export default DescriptionModal;
