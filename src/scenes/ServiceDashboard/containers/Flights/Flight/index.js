import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import c from 'classnames';
import { useTranslation } from 'react-i18next';
import DateCell from 'src/components/DateCell';
import AmountCell from 'src/components/AmountCell';
import {
  SWISS_NUMBER_FORMAT,
} from 'src/constants';
import {
  Link,
} from 'react-router-dom';
import { Tooltip, Icons, Tag } from '@adnz/ui';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import Responsive from 'react-responsive';
import Colors from 'src/theme/Colors';
import { fromDateTimeType } from '@adnz/api-helpers';
import VisibilityAlert from '../components/VisibilityAlert';
import * as selectors from '../selectors';

const StatusIcon = styled(Tag)`
  margin-bottom: 0;
`;

const Flight = ({
  index,
  itemId,
  type,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const amountHasData = useSelector((state) => selectors.amountHasData(state, { instance: `flights-${type}` }));
  const flight = useSelector((state) => selectors.getItem(state, { itemId }));

  const getStatus = (stateColor) => {
    if (flight.get(stateColor) === 'red') {
      return Colors.Scarlet;
    }
    if (flight.get(stateColor) === 'yellow') {
      return Colors['adnz-warning'];
    }
    return Colors['adnz-green'];
  };

  const shortcutStatusClass = c(
    { 'status-color_success': flight.get('deliveryRateColor') === 'green' },
    { 'status-color_warning': flight.get('deliveryRateColor') === 'yellow' },
    { 'status-color_danger': flight.get('deliveryRateColor') === 'red' },
  );

  return (
    <tbody className={c('dash-tbody', 'position', shortcutStatusClass)}>
      <tr className={index % 2 === 0 ? 'even' : 'odd'}>
        <Responsive minWidth={992}>
          <td>
            {flight.get('statusColor') === 'green' && <Icons.Stop color={Colors['adnz-green']} />}
            {flight.get('statusColor') === 'yellow' && <Icons.Stop color={Colors['adnz-warning']} />}
            {flight.get('statusColor') === 'red' && <Icons.Stop color={Colors.Scarlet} />}
          </td>
        </Responsive>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label mobile-cell__label_first">
              {t('serviceDashboard:ORDER_NUMBER')}
            </p>
          </Responsive>
          <Link to={`/buy-side/campaigns/ALL/${flight.get('campaignId')}`}>
            {flight.get('campaignInternalOrderNumber')}
          </Link>
          {!!flight.get('campaignAdvertiser') && (
            <>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:CAMPAIGN')}
                </p>
              </Responsive>
              <Responsive maxWidth={991}>
                <span>
                  {flight.get('campaignAdvertiser')}
                </span>
              </Responsive>
              <Responsive minWidth={992}>
                <span>
                  {` – ${flight.get('campaignAdvertiser')}`}
                </span>
              </Responsive>
            </>
          )}
          <br />
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:NAME')}
            </p>
          </Responsive>
          <span className="break-word">{flight.get('name')}</span>
          {flight.get('info') !== null && (
            <>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:INFORMATION')}
                </p>
              </Responsive>
              <em>
                <Responsive minWidth={992}>
                  <br />
                </Responsive>
                {flight.get('info')}
              </em>
            </>
          )}
        </td>
        <Responsive maxWidth={991}>
          <td>
            <p className="mobile-cell__label">
              {t('serviceDashboard:START_DATE')}
            </p>
          </td>
        </Responsive>
        <DateCell value={fromDateTimeType(flight.get('fromDate'))} />
        <Responsive maxWidth={991}>
          <td>
            <p className="mobile-cell__label">
              {t('serviceDashboard:END_DATE')}
            </p>
          </td>
        </Responsive>
        <DateCell value={fromDateTimeType(flight.get('toDate'))} />
        <td>
          {flight.get('total') !== null && (
            <>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:TOTAL')}
                </p>
              </Responsive>
              <span>
                {SWISS_NUMBER_FORMAT.format(flight.get('total', 0))}
              </span>
            </>
          )}
        </td>
        <td>
          {flight.get('deliveredItems') !== null && (
            <>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:DELIVERED_ITEMS')}
                </p>
              </Responsive>
              <span>
                {SWISS_NUMBER_FORMAT.format(flight.get('deliveredItems', 0))}
              </span>
            </>
          )}
        </td>
        <td style={{ width: 100, textAlign: 'right' }}>
          {!!flight.get('deliveryRate') && !!flight.get('deliveryRateColor') && (
            <>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:DELIVERY_RATE')}
                </p>
              </Responsive>
              <StatusIcon
                color={getStatus('deliveryRateColor')}
                value={flight.get('deliveryRate') > 500 ? '> 500%' : flight.get('deliveryRate').toFixed(2)}
              />
            </>
          )}
        </td>
        <td style={{ width: 60 }}>
          {!!flight.get('ctr') && (
            <>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:CLICK_TROUGH_RATES_SHORT')}
                </p>
              </Responsive>
              <Tooltip
                tooltip={(
                  <>
                    <strong>
                      {t('serviceDashboard:IMPRESSIONS')}
                      :
                    </strong>
                    {SWISS_NUMBER_FORMAT.format(flight.get('deliveredImpressions', 0))}
                    <br />
                    <strong>
                      {t('serviceDashboard:CLICKS')}
                      :
                    </strong>
                    {SWISS_NUMBER_FORMAT.format(flight.get('deliveredClicks', 0))}
                  </>
                )}
                placement="top"
              >
                <StatusIcon
                  color={getStatus('ctrColor')}
                  value={flight.get('ctr').toFixed(2)}
                />
              </Tooltip>
            </>
          )}
        </td>
        <td style={{ width: 90 }} className="text-left">
          <>
            {!!flight.get('visibility') && (
              <>
                <Responsive maxWidth={991}>
                  <p className="mobile-cell__label">
                    {t('serviceDashboard:VISIBILITY')}
                  </p>
                </Responsive>
                <StatusIcon
                  color={getStatus('visibilityColor')}
                  value={flight.get('visibility').toFixed(2)}
                />
              </>
            )}
            <PrivateRoute
              roles={Roles.ADMIN}
              render={() => (
                <VisibilityAlert position={flight} />
              )}
            />
          </>
        </td>
        {amountHasData && (
        <AmountCell
          value={flight.get('amountNet2')}
          visible={flight.get('showAmount') !== false}
          currency={flight.get('currency')}
          responsive
          responsiveTitle={t('serviceDashboard:AMOUNT')}
        />
        )}
      </tr>
    </tbody>
  );
};

Flight.propTypes = {
  index: PropTypes.number.isRequired,
  itemId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Flight;
