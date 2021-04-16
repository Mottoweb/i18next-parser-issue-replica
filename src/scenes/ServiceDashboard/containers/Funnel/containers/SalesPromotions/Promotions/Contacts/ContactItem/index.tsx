import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Label, Checkbox, Table, Icons,
} from '@adnz/ui';
import styled from 'styled-components';
import confirmAlert from 'src/components/confirmAlert';
import { useRequest } from '@adnz/use-request';
import {
  removeSalesPromotionContacts,
  SalesPromotionContact,
} from '@adnz/api-ws-funnel';
import notify from 'src/modules/Notification';
import { useDispatch, useSelector } from '../../../context';
import * as selectors from '../../../selectors';
import * as actions from '../../../actions';

const CheckboxContainer = styled(Label)`
  margin: 0;
  justify-content: center;
`;

const ContactItem: React.FC<{ contact: SalesPromotionContact, salesPromotionId: string, index: number }> = ({
  contact, salesPromotionId, index,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const dispatch = useDispatch();
  const selectedContactIds = useSelector(selectors.getSelectedContactIds, []);
  const isCheckboxChecked = React.useMemo(
    () => selectedContactIds.includes(contact.contactId),
    [selectedContactIds, contact],
  );

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

  const confirm = () => confirmAlert({
    title: t('serviceDashboard:CONFIRM_REMOVE'),
    message: t('serviceDashboard:ARE_YOU_SURE_TO_REMOVE_CONTACT'),
    buttons: [
      {
        label: t('serviceDashboard:YES_LABEL'),
        onClick: (close) => {
          removeContacts([contact.contactId], { salesPromotionId });
          close();
        },
      },
    ],
    closeText: t('serviceDashboard:NO_LABEL'),
  });

  const openEditContactModal = () => dispatch(actions.OPEN_EDIT_CONTACT(contact.contactId));
  const selectContact = () => dispatch(actions.SELECT_CONTACT({ id: contact.contactId, isRemove: isCheckboxChecked }));

  return (
    <Table.Tr key={contact.contactId}>
      <Table.Td css="width: 1px;">
        <CheckboxContainer>
          <Checkbox checked={isCheckboxChecked} onChange={selectContact} square />
        </CheckboxContainer>
      </Table.Td>
      <Table.Td className="text-left">
        {contact.firstName}
      </Table.Td>
      <Table.Td className="text-left">
        {contact.lastName}
      </Table.Td>
      <Table.Td className="text-left">
        {contact.phone}
      </Table.Td>
      <Table.Td className="text-left">
        {contact.email}
      </Table.Td>
      <Table.Td>
        <Link to={`/buy-side/accounts/${contact.accountId}`}>
          #
          {contact.accountName}
        </Link>
      </Table.Td>
      <Table.Td className="text-left">
        {contact.status}
      </Table.Td>
      <Table.Td className="text-left">
        {contact.isActive ? t('serviceDashboard:TRUE') : t('serviceDashboard:FALSE')}
      </Table.Td>
      <Table.Td css="width: 1px;" type="action">
        <Table.ActionsList rowIndex={index}>
          <Table.ActionsListItem
            onClick={openEditContactModal}
            icon={(<Icons.Edit />)}
          >
            {t('serviceDashboard:EDIT')}
          </Table.ActionsListItem>
          <Table.ActionsListItem
            onClick={confirm}
            icon={(<Icons.Trash />)}
          >
            {t('serviceDashboard:DELETE')}
          </Table.ActionsListItem>
        </Table.ActionsList>
      </Table.Td>
    </Table.Tr>
  );
};

export default ContactItem;
