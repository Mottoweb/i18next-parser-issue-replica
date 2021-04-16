import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const PrintValue = ({ value, trigger }) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  if (value === 'null') {
    return (
      <span>&ndash;</span>
    );
  }
  if (['ownerContact', 'classifiedsSalesContact'].includes(trigger)) {
    return (
      <span>{value.replace(/\s\(.+\)$/, '')}</span>
    );
  }
  if (/^\[.+\]$/.test(value)) {
    return (
      <span>{value.replace(/[[\]]/g, '').split(', ').map((item) => t(item)).join(', ')}</span>
    );
  }
  return <span>{value}</span>;
};

PrintValue.propTypes = {
  value: PropTypes.string.isRequired,
  trigger: PropTypes.string,
};

PrintValue.defaultProps = {
  trigger: null,
};

export default PrintValue;
