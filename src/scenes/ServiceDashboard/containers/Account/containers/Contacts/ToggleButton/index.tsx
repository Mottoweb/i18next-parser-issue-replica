import React from 'react';
import { Map } from 'immutable';
import { useRequest } from '@adnz/use-request';
import { enableContact as enableContactApi, disableContact as disableContactApi } from '@adnz/api-ws-salesforce';
import { Switch } from '@adnz/ui';

export interface ToggleButtonProps {
  contact: Map<'id', string> & Map<'active', boolean>,
  onSuccess?: () => void,
}
const ToggleButton: React.FC<ToggleButtonProps> = ({ contact, onSuccess }) => {
  const [,, disableContact] = useRequest({
    apiMethod: disableContactApi,
    runOnMount: false,
    onSuccess,
  });

  const [,, enableContact] = useRequest({
    apiMethod: enableContactApi,
    runOnMount: false,
    onSuccess,
  });

  const handleChange = React.useCallback(() => {
    if (contact.get('active')) {
      disableContact({ id: contact.get('id') });
    } else {
      enableContact({ id: contact.get('id') });
    }
  }, [contact, disableContact, enableContact]);

  return (
    <Switch
      checked={contact.get('active')}
      onChange={handleChange}
    />
  );
};

export default ToggleButton;
