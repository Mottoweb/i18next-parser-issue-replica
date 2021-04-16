import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Tooltip,
  Checkbox,
  Label,
  Icons,
} from '@adnz/ui';
import * as actions from '../../../actions';
import * as selectors from '../../../selectors';

const Contact = ({
  contactId,
  taskId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const openEmailModal = React.useCallback(
    () => dispatch(actions.openEmailModal(contactId, taskId)),
    [dispatch, contactId, taskId],
  );
  const addContactAsDefault = React.useCallback(
    () => dispatch(actions.addContactAsDefault(taskId, contactId)),
    [dispatch, taskId, contactId],
  );
  const removeTaskContactFromDefault = React.useCallback(
    () => dispatch(actions.removeTaskContactFromDefault(taskId, contactId)),
    [dispatch, taskId, contactId],
  );
  const contact = useSelector((state) => selectors.getContact(state, { contactId }));
  const isLoadingEmailModal = useSelector((state) => selectors.isLoadingEmailModal(state, { contactId }));
  const isDisabledEmailButton = useSelector(
    (state) => selectors.isDisabledEmailButton(state, { itemId: taskId, contactId }),
  );
  const isTaskContact = useSelector(
    (state) => selectors.isTaskContact(state, { itemId: taskId, contactId }),
  );
  const isGmailSync = useSelector(selectors.isGmailSync);
  if (!contact) {
    return null;
  }
  const toolTipMessage = isTaskContact ? t('serviceDashboard:GMAIL_SYNC_REQUIRED_MESSAGE') : t('serviceDashboard:MAKE_DEFAULT_CONTACT_MESSAGE');

  return (
    <tbody className="dash-tbody position">
      <tr
        className={!isTaskContact ? 'dash-gray-light' : null}
        data-testid={!isTaskContact ? 'contact-unchecked' : 'contact-checked'}
      >
        <td css="width: 1px;">
          <Label
            data-testid="default-task-contact-checkbox"
            css="cursor: pointer; font-size: 13px; margin: 0; white-space: nowrap;"
          >
            <Checkbox
              css="margin-right: 5px;"
              checked={isTaskContact}
              onChange={isTaskContact ? removeTaskContactFromDefault : addContactAsDefault}
            />
            {t('serviceDashboard:IS_DEFAULT_TASK_CONTACT')}
          </Label>
        </td>
        <td>{contact.get('name')}</td>
        <td>{t(contact.get('source'))}</td>
        <td>{t(contact.get('function'))}</td>
        <td><a href={`mailto:${contact.get('email')}`}>{contact.get('email')}</a></td>
        <td><a href={`tel:${contact.get('phoneNoFormatting')}`}>{contact.get('phone')}</a></td>
        <td>
          <ButtonGroup>
            {(isGmailSync && isTaskContact)
              ? (
                <Button
                  data-testid="open-email-modal-button"
                  onClick={openEmailModal}
                  disabled={isDisabledEmailButton}
                  isLoading={isLoadingEmailModal}
                  icon
                >
                  <Icons.Email size={18} />
                </Button>
              )
              : (
                <Tooltip
                  tooltip={toolTipMessage}
                  placement="top"
                >
                  <Button
                    data-testid="disabled-email-modal-button"
                    onClick={openEmailModal}
                    pseudoDisabled={isDisabledEmailButton}
                    isLoading={isLoadingEmailModal}
                    icon
                  >
                    <Icons.Email size={18} />
                  </Button>
                </Tooltip>
              )}
          </ButtonGroup>
        </td>
      </tr>
    </tbody>
  );
};

Contact.propTypes = {
  contactId: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
};

export default Contact;
