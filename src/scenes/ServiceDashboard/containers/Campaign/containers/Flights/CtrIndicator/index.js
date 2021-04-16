import React from 'react';
import PropTypes from 'prop-types';
import CtrIndicator from '../../../../../CtrIndicator';

const commonRules = [
  { min: 0.15, value: 'green' },
  { min: 0.1, value: 'yellow' },
  { min: 0, value: 'red' },
];

const bcRules = [
  { min: 0.05, value: 'green' },
  { min: 0.03, value: 'yellow' },
  { min: 0, value: 'red' },
];

const CtrIndicatorWrapper = ({ flightName, ...props }) => {
  const rules = flightName.startsWith('Business Click_') ? bcRules : commonRules;
  return (
    <CtrIndicator
      rules={rules}
      {...props}
    />
  );
};

CtrIndicatorWrapper.propTypes = {
  flightName: PropTypes.string.isRequired,
};

export default CtrIndicatorWrapper;
