import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import useMarkdown from 'src/hooks/useMarkdown';
import * as actions from '../../../../actions';
import * as selectors from '../../../../selectors';
import { SourceWrapper } from './styles';

const DescriptionModal = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const isModalOpened = useSelector(selectors.isSourceDescriptionModalOpened);
  const description = useSelector(selectors.getSourceDescriptionForModal);
  const html = useMarkdown(description);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeSourceModal()),
    [dispatch],
  );
  return (
    <Modal
      isOpen={isModalOpened}
      onRequestClose={closeModal}
      title={t('serviceDashboard:SOURCE_DESCRIPTION_TITLE')}
    >
      <Modal.Body>
        <SourceWrapper
          id="source-modal-window"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Modal.Body>
    </Modal>
  );
};

export default DescriptionModal;
