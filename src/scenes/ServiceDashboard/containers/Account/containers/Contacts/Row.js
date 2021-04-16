import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Link,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icons } from '@adnz/ui';
import ToggleButton from './ToggleButton';

const StyledLink = styled(Link)`
  display: inline-flex;
  border: none;
  outline: none !important;
  background: transparent !important;
  padding: 0 3px;
  font-size: 26px;
  min-width: 42px;
  max-width: 42px;
  min-height: 38px;
  max-height: 38px;
  align-items: center;
  justify-content: center;
  transition: transform .1s, color .1s;
  will-change: transform, color;
  cursor: pointer;
    :hover {
      transform: scale(1.1);
    }
`;

const Row = ({
  accountId,
  itemId,
  contact,
  handleSuccess,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <tr
      className="dash-tbody position"
      data-testid="contacts-table"
    >
      <td data-testid="last-name-contact-column">{contact.get('lastName')}</td>
      <td data-testid="first-name-contact-column">{contact.get('firstName')}</td>
      <td>{contact.get('function')}</td>
      <td>{contact.get('email')}</td>
      <td>{contact.get('phone')}</td>
      <td>{contact.get('phoneMobile')}</td>
      <td>{contact.get('active') ? t('serviceDashboard:TRUE') : t('serviceDashboard:FALSE')}</td>
      <td data-testid="inactive-contact-switcher">
        <ToggleButton contact={contact} onSuccess={handleSuccess} />
      </td>
      <td>
        <div className="default-btn-group flex-container_j-end">
          <StyledLink
            to={`/buy-side/accounts/edit/${accountId}/contacts/${itemId}`
            + `?redirectTo=/buy-side/accounts/${accountId}`}
          >
            <Icons.Edit />
          </StyledLink>
        </div>
      </td>
    </tr>
  );
};

Row.propTypes = {
  accountId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  handleSuccess: PropTypes.func.isRequired,
  contact: PropTypes.instanceOf(Object).isRequired,
};

export default Row;
