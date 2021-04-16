import React from 'react';
import PropTypes from 'prop-types';
import CustomCell from 'src/components/CustomCell';
import { useTranslation } from 'react-i18next';
import { Icons } from '@adnz/ui';
import { Div } from '../styles';
import { getTagColor } from '../helpers';

const CtrIndicator = ({
  rules,
  ctr,
  children,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  if (!ctr) {
    return <CustomCell.Label title={t('serviceDashboard:CTR')} />;
  }
  const ctrColor = rules.find((v) => v.min <= ctr).value;
  return (
    <CustomCell.Label
      tooltip={(
        <>
          <p>
            {children}
          </p>
          {rules.map((rule) => (
            <Div key={rule.min}>
              <Icons.Stop
                color={getTagColor(rule.value)}
              />
              &nbsp;
              {' '}
              ≥
              &nbsp;
              {rule.min.toFixed(2)}
              %
            </Div>
          ))}
        </>
      )}
      value={ctr.toFixed(2)}
      statusColor={ctrColor}
      title={t('serviceDashboard:CTR')}
      md={3}
    />
  );
};

CtrIndicator.propTypes = {
  rules: PropTypes.arrayOf(PropTypes.shape({
    min: PropTypes.number,
    value: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  ctr: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default CtrIndicator;
