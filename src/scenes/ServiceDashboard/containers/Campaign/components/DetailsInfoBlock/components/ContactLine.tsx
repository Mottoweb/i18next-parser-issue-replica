import React from 'react';
import { ContactShort } from '@adnz/api-ws-salesforce';

const ContactLine:React.FC<{ contact?: ContactShort }> = ({ contact }) => {
  if (!contact) return null;
  return (
    <div>
      {!!contact.name && (
        <span>
          {contact.name}
        </span>
      )}
      &nbsp;
      {!!contact.email && (
        <div>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      )}
      {!!contact.phone && (
        <div>
          <a href={`tel:${contact.phoneNoFormatting}`}>{contact.phone}</a>
        </div>
      )}
    </div>
  );
};

export default ContactLine;
