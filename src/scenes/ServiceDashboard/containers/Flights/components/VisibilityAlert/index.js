import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Tooltip, Icons } from '@adnz/ui';
import Colors from 'src/theme/Colors';

const VisibilityAlert = ({
  position,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  if (!position.get('visibility')
    || position.get('deliveredImpressions') < 100
    || (
      position.get('visiblePerDeliveredPercentage') >= 20
      && position.get('visibilityImpressions') >= 100
    )) {
    return null;
  }
  return (
    <Tooltip
      tooltip={(
        <>
          <strong>
            {t('serviceDashboard:VISIBLE_PER_DELIVERED_PERCENTAGE')}
            :
          </strong>
          {parseFloat(position.get('visiblePerDeliveredPercentage')).toFixed(2)}
          %
          <br />
          <strong>
            {t('serviceDashboard:VISIBILITY_IMPRESSIONS')}
            :
          </strong>
          {position.get('visibilityImpressions')}
        </>
      )}
      placement="top"
    >
      <Icons.WarningCircle
        css="margin-left: 10px;"
        color={Colors['pale-red']}
        size={19}
      />
    </Tooltip>
  );
};

VisibilityAlert.propTypes = {
  position: PropTypes.instanceOf(Object).isRequired,
};

export default VisibilityAlert;
