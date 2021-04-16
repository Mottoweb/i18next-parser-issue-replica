import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SectionTitle from 'src/components/SectionTitle';
import CreateForm from './CreateForm';
import ActivityTable from './ActivityTable';

const Activities = ({
  accountId,
  taskId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  return (
    <div className="forms-page">
      <SectionTitle>{t('serviceDashboard:ACTIVITIES')}</SectionTitle>
      <CreateForm taskId={taskId} accountId={accountId} />
      <ActivityTable taskId={taskId} />
    </div>
  );
};

Activities.propTypes = {
  accountId: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
};

export default Activities;
