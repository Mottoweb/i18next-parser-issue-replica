import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@adnz/ui';
import * as actions from '../../actions';
import * as selectors from '../../selectors';
import Attachment from './containers';
import EmailContent from '../../components/EmailContent';

const EmailModal = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const isEmailModalOpened = useSelector(selectors.isEmailModalOpened);
  const EmailBody = useSelector(selectors.getEmailBody);
  const Attachments = useSelector(selectors.getEmailAttachments);
  const dispatch = useDispatch();
  const closeModal = React.useCallback(
    () => dispatch(actions.closeModal()),
    [dispatch],
  );
  return (
    <Modal
      isOpen={isEmailModalOpened}
      onRequestClose={closeModal}
      title={t('serviceDashboard:VIEW_EMAIL')}
    >
      <Modal.Body>
        {Attachments.size > 0
          && (
          <div className="email-modal__content-header" data-testid="task-email-details-modal">
            {Attachments.map((attach) => (
              <Attachment key={attach.get('id')} itemId={attach.get('id')} />
            ))}
          </div>
          )}
        {!!isEmailModalOpened && <EmailContent body={EmailBody} />}
      </Modal.Body>
    </Modal>
  );
};

export default EmailModal;
