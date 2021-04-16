import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icons } from '@adnz/ui';
import Colors from 'src/theme/Colors';
import * as selectors from 'src/selectors';
import DateCell from 'src/components/DateCell';
import Responsive from 'react-responsive';
import { fromDateTimeType } from '@adnz/api-helpers';

const Row = ({
  itemId,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const item = useSelector((state) => selectors.getDealDto(state, { itemId }));
  return (
    <tbody className="dash-tbody">
      <tr>
        <td>
          <div className="default-table__td">
            <div>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:ID_FIELD')}
                </p>
              </Responsive>
              {item.get('id')}
            </div>
          </div>
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:NAME')}
            </p>
          </Responsive>
          {item.get('name')}
        </td>
        <td className="text-center">
          {item.get('active') && (
            <>
              <Responsive maxWidth={991}>
                <p className="mobile-cell__label">
                  {t('serviceDashboard:ACTIVE')}
                </p>
              </Responsive>
              <Icons.CheckCircle
                size={16}
                color={Colors['greyish-brown']}
                css="vertical-align: middle;"
              />
            </>
          )}
        </td>
        <DateCell
          value={fromDateTimeType(item.get('startDate'))}
          responsive
          responsiveTitle={t('serviceDashboard:START_DATE')}
        />
        <DateCell
          value={fromDateTimeType(item.get('endDate'))}
          responsive
          responsiveTitle={t('serviceDashboard:END_DATE')}
        />
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:BUYER_NAME')}
            </p>
          </Responsive>
          {item.get('buyerName')}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:ASK_PRICE')}
            </p>
          </Responsive>
          {item.get('askPrice')}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:CURRENCY')}
            </p>
          </Responsive>
          {item.get('currency')}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:AUCTION_TYPE')}
            </p>
          </Responsive>
          {item.get('auctionType')}
        </td>
        <DateCell
          value={fromDateTimeType(item.get('lastModifiedDate'))}
          responsive
          responsiveTitle={t('serviceDashboard:LAST_MODIFIED')}
        />
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:IMPRESSION_MATCHED')}
            </p>
          </Responsive>
          {item.get('impressionsMatched')}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:BID_REQUESTS')}
            </p>
          </Responsive>
          {item.get('bidRequests')}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:BIDS')}
            </p>
          </Responsive>
          {item.get('bids')}
        </td>
        <td>
          <Responsive maxWidth={991}>
            <p className="mobile-cell__label">
              {t('serviceDashboard:SELLER_REVENUE')}
            </p>
          </Responsive>
          {item.get('sellerRevenue')}
        </td>
      </tr>
    </tbody>
  );
};

Row.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default Row;
