import React from 'react';
import {
  Button, ButtonGroup, DropdownList, Table, Section,
} from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import SectionTitle from 'src/components/SectionTitle';
import ToggleAll from 'src/scenes/Workflow/containers/Operations/containers/Booked/containers/CampaignItem/ToggleAll';
import { useRequest } from '@adnz/use-request';
import { removeSalesPromotionContacts } from '@adnz/api-ws-funnel';
import notify from 'src/modules/Notification';
import { useDispatch, useSelector } from '../../context';
import ContactItem from './ContactItem';
import * as selectors from '../../selectors';
import AddContactsForm from './AddContactsForm';
import EditContactForm from './EditContactForm';
import ChangeContactStatusForm from './ChangeContactStatusForm';
import AddContactToPromotionForm from './AddContactToPromotionForm';
import * as actions from '../../actions';

const Contacts: React.FC<{ salesPromotionId: string }> = ({ salesPromotionId }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const contacts = useSelector(selectors.getContacts, []);
  const isAllContactsShown = useSelector(selectors.isAllContactsShown, []);
  const selectedContactIds = useSelector(selectors.getSelectedContactIds, []);
  const isCheckboxChecked = React.useMemo(
    () => selectedContactIds.length === contacts.length,
    [selectedContactIds.length, contacts.length],
  );
  const DEFAULT_SHOWN_AMOUNT = 15;
  const contactsToShow = isAllContactsShown ? contacts : contacts.slice(0, DEFAULT_SHOWN_AMOUNT);
  const selectAll = () => dispatch(actions.SELECT_CONTACTS({
    ids: contacts.map((a) => a.contactId),
    isRemove: isCheckboxChecked,
  }));

  const [,, removeContacts] = useRequest({
    apiMethod: removeSalesPromotionContacts,
    runOnMount: false,
    onFail: React.useCallback(
      (error) => {
        notify.danger(t('serviceDashboard:ERROR'), t(error.response?.data.message));
      },
      [t],
    ),
    onSuccess: React.useCallback(
      (newItem) => {
        notify.success('', t('serviceDashboard:SALES_PROMOTION_CONTACT_REMOVED'));
        dispatch(actions.UPDATE_PROMOTION(newItem));
      },
      [dispatch, t],
    ),
  });

  const openAddContactsModal = () => dispatch(actions.OPEN_ADD_CONTACTS());
  const openChangeStatusModal = () => dispatch(actions.OPEN_CHANGE_STATUS());
  const openAddToPromotionModal = () => dispatch(actions.OPEN_ADD_TO_PROMOTION());
  const toggleShowAll = () => dispatch(actions.TOGGLE_SHOW_ALL_CONTACTS());

  return (
    <div>
      <div className="table-responsive overflow-y-auto">
        <AddContactsForm salesPromotionId={salesPromotionId} />
        <ChangeContactStatusForm salesPromotionId={salesPromotionId} />
        <AddContactToPromotionForm />
        <EditContactForm />
        <SectionTitle>
          <span>{t('serviceDashboard:CONTACTS')}</span>
          <Button onClick={openAddContactsModal} id="create-button">{t('serviceDashboard:ADD_CONTACTS')}</Button>
        </SectionTitle>
        <Section>
          <Table>
            <thead>
              <Table.Tr>
                <Table.Th css="width: 1px;">
                  <ToggleAll checked={isCheckboxChecked} handleChange={selectAll} />
                </Table.Th>
                <Table.Th>{t('serviceDashboard:FIRST_NAME')}</Table.Th>
                <Table.Th>{t('serviceDashboard:LAST_NAME')}</Table.Th>
                <Table.Th>{t('serviceDashboard:PHONE')}</Table.Th>
                <Table.Th>{t('serviceDashboard:EMAIL')}</Table.Th>
                <Table.Th>{t('serviceDashboard:ACCOUNT')}</Table.Th>
                <Table.Th>{t('serviceDashboard:STATUS')}</Table.Th>
                <Table.Th>{t('serviceDashboard:ACTIVE')}</Table.Th>
                <Table.Th data-testid="dropdown-container-button">
                  <DropdownList
                    id="promotion_contacts_menu"
                    css="margin-bottom: 5px;"
                    theme="create"
                    inThead
                  >
                    <DropdownList.Item
                      data-testid="change-status-list-item"
                      onClick={openChangeStatusModal}
                      disabled={selectedContactIds.length === 0}
                      children={t('serviceDashboard:CHANGE_STATUS')}
                    />
                    <DropdownList.Item
                      data-testid="add-to-promotion-list-item"
                      onClick={openAddToPromotionModal}
                      disabled={selectedContactIds.length === 0}
                      children={t('serviceDashboard:ADD_TO_PROMOTION')}
                    />
                    <DropdownList.Item
                      data-testid="remove-acocunts-list-item"
                      onClick={() => removeContacts(selectedContactIds, { salesPromotionId })}
                      disabled={selectedContactIds.length === 0}
                      children={t('serviceDashboard:DELETE')}
                    />
                  </DropdownList>
                </Table.Th>
              </Table.Tr>
            </thead>
            <tbody className="dash-tbody">
              {contactsToShow.map((contact, index) => (
                <ContactItem
                  key={contact.contactId}
                  contact={contact}
                  salesPromotionId={salesPromotionId}
                  index={index}
                />
              ))}
            </tbody>
          </Table>
        </Section>
      </div>
      <div className="spacer" />
      {contacts.length > DEFAULT_SHOWN_AMOUNT && (
      <ButtonGroup align="right">
        <Button
          data-testid="show-more-contact-table"
          onClick={toggleShowAll}
          theme="create-secondary"
        >
          {isAllContactsShown ? t('serviceDashboard:SHOW_LESS') : t('serviceDashboard:SHOW_MORE')}
        </Button>
      </ButtonGroup>
      )}
    </div>
  );
};

export default Contacts;
