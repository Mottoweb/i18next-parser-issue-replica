import React from 'react';
import { SubHeader } from '@adnz/ui';
import { useTranslation } from 'react-i18next';

const SettingsMenu: React.FC = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <SubHeader>
      <SubHeader.Nav>
        <SubHeader.NavItem to="/workflows/salesFunnel/tags" dataTestId="salesFunnel-labels-link">
          {t('serviceDashboard:SALESFUNNEL_LABELS')}
        </SubHeader.NavItem>
        <SubHeader.NavItem to="/workflows/salesFunnel/sources" dataTestId="sources-link">
          {t('serviceDashboard:SOURCES')}
        </SubHeader.NavItem>
        <SubHeader.NavItem to="/workflows/salesFunnel/topics" dataTestId="meeting-topics-link">
          {t('serviceDashboard:MEETING_TOPICS')}
        </SubHeader.NavItem>
        <SubHeader.NavItem to="/workflows/salesFunnel/task-topics" dataTestId="task-topics-link">
          {t('serviceDashboard:TASK_TOPICS')}
        </SubHeader.NavItem>
      </SubHeader.Nav>
    </SubHeader>
  );
};

export default SettingsMenu;
