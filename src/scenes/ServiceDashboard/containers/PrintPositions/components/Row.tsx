import React from 'react';
import Responsive from 'react-responsive';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Table } from '@adnz/ui';
import { CampaignPositionDto, fromDate } from '@adnz/api-ws-print';

import Date from 'src/components/Date';
import { getSwissAmountFormat } from 'src/constants';

export interface IRow {
  position: CampaignPositionDto
}

const Row: React.FC<IRow> = ({
  position,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);

  return (
    <Table.Tbody>
      <Table.Tr>
        <Table.Td>
          <div>
            <Responsive maxWidth={991}>
              <p className="mobile-cell__label mobile-cell__label_first">
                {t('serviceDashboard:ORDER_NUMBER')}
              </p>
            </Responsive>
            <Link to={`/buy-side/campaigns/ALL/${position.campaignId}`}>
              {position.campaignInternalOrderNumber}
            </Link>
            {!!position.campaignAdvertiser && (
              <>
                <Responsive maxWidth={991}>
                  <p className="mobile-cell__label">
                    {t('serviceDashboard:CAMPAIGN')}
                  </p>
                </Responsive>
                <Responsive maxWidth={991}>
                  <span>
                    {position.campaignAdvertiser}
                  </span>
                </Responsive>
                <Responsive minWidth={992}>
                  <span>
                    {` – ${position.campaignAdvertiser}`}
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
            <span className="break-word">{position.name}</span>
            {position.info !== null && (
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
                  {position.info}
                </em>
              </>
            )}
          </div>
        </Table.Td>
        <Table.Td>
          {position.chiffreNumber}
        </Table.Td>
        <Table.Td>
          <Date value={fromDate(position.publicationDate)} />
        </Table.Td>
        <Table.Td>
          {position.productionSize}
        </Table.Td>
        <Table.Td>
          {t(position.color)}
        </Table.Td>
        <Table.Td>
          {getSwissAmountFormat().format(position.amountNet4)}
        </Table.Td>
      </Table.Tr>
    </Table.Tbody>
  );
};

export default Row;
