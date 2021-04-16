import React from 'react';
import { Link } from 'react-router-dom';
import { AccountShort } from '@adnz/api-ws-salesforce';
import { useIdentityRoles } from '@adnz/use-auth';

const LinkName:React.FC<{ account: AccountShort, className?: string }> = ({
  account,
  className = '',
}) => {
  const { MANAGE_ACCOUNTS } = useIdentityRoles();
  if (!account.name) return null;
  if (!account.hasPermission) return <p>{account.name}</p>;
  return (
    <span>
      {!!MANAGE_ACCOUNTS && (
        <Link className={className} to={`/buy-side/accounts/${account.id}`}>{account.name}</Link>
      )}
      {!MANAGE_ACCOUNTS && (
        account.name
      )}
    </span>
  );
};

export default LinkName;
