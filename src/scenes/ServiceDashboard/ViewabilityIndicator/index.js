import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CustomCell from 'src/components/CustomCell';
import { Icons } from '@adnz/ui';
import { Div } from '../styles';
import { getTagColor } from '../helpers';

const mobileRules = [
  { min: 50, value: 'green' },
  { min: 35, value: 'yellow' },
  { min: 0, value: 'red' },
];

const nonMobileRules = [
  { min: 70, value: 'green' },
  { min: 50, value: 'yellow' },
  { min: 0, value: 'red' },
];

const ViewabilityIndicator = ({
  viewability,
  flightName,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  const rules = flightName.startsWith('includes') ? mobileRules : nonMobileRules;
  const viewabilityColor = rules.find((v) => v.min <= viewability).value;

  if (!viewability) {
    return <CustomCell.Label title={t('serviceDashboard:VIEWABILITY')} />;
  }
  return (
    <CustomCell.Label
      tooltip={rules.map((rule) => (
        <Div key={rule.min}>
          <Icons.Stop
            color={getTagColor(rule.value)}
          />
          &nbsp;
          {' '}
          ≥
          &nbsp;
          {rule.min.toFixed(0)}
          %
        </Div>
      ))}
      value={viewability.toFixed(2)}
      statusColor={viewabilityColor}
    />
  );
};

ViewabilityIndicator.propTypes = {
  viewability: PropTypes.number.isRequired,
  flightName: PropTypes.string.isRequired,
};

export default ViewabilityIndicator;
