import React from 'react';
import { Link } from 'react-router-dom';
import { AccountDto } from '@adnz/api-ws-salesforce';

const Name:React.FC<{ account: AccountDto }> = ({
  account,
}) => {
  if (!account.hasPermission) return <span>{account.displayName}</span>;
  return (
    <Link to={`/buy-side/accounts/${account.id}`}>{account.displayName}</Link>
  );
};

export default Name;
