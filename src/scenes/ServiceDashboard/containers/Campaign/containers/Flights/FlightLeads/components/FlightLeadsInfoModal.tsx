import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Modal, Input, Loader, Label,
} from '@adnz/ui';
import { useRequest } from '@adnz/use-request';
import { getPositionLeadsEndpoint } from '@adnz/api-ws-funnel';

interface FlightLeadsInfoModalProps {
  onClose: () => void;
  formTemplateId: string;
}

export const FlightLeadsInfoModal: React.FC<FlightLeadsInfoModalProps> = ({ onClose, formTemplateId }) => {
  const { t } = useTranslation(['translation', 'common', 'serviceDashboard']);

  const [endpoint, { pending: isLoading }] = useRequest({
    apiMethod: getPositionLeadsEndpoint,
    parameters: [{ formTemplateId }],
  });

  const selectAllOnClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.focus();
    e.currentTarget.select();
  }, []);

  return (
    <Modal isOpen onRequestClose={onClose} title={t('serviceDashboard:INFORMATION')}>
      <Modal.Body>
        {
          isLoading ? <Loader /> : (
            <Label css="display: block; ">
              <div css="margin-bottom: 10px;">{t('serviceDashboard:ENDPOINT')}</div>
              <div><Input type="text" value={endpoint || ''} onClick={selectAllOnClick} /></div>
            </Label>
          )
        }
      </Modal.Body>
    </Modal>
  );
};
