import React from 'react';
import { useTranslation } from 'react-i18next';

import { Table } from '@adnz/ui';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import { CampaignPositionDto, fromDate, fromDateTime } from '@adnz/api-ws-print';

import DateTime from 'src/components/DateTime';
import { DATE_FORMAT, getSwissAmountFormat } from 'src/constants';

import PrintPositionScreenshots from './PrintPositionScreenshots';

interface IPrintPositionRow {
  campaign: CampaignDto,
  position: CampaignPositionDto,
  isAmountShown: boolean,
}

const PrintPositionRow: React.FC<IPrintPositionRow> = ({
  campaign,
  position,
  isAmountShown,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [opened, setOpened] = React.useState(false);

  return (
    <Table.Tbody
      isOpen={opened}
      inGroup={!!position.positionGroup}
      subContent={(
        <PrintPositionScreenshots
          campaignId={campaign.campaignId}
          motiveNumber={position.motiveNumber}
        />
      )}
    >
      <Table.Tr onClick={() => setOpened((s) => !s)}>
        <Table.Td>
          {position.sortOrder}
        </Table.Td>
        <Table.Td>
          {position.name}
        </Table.Td>
        <Table.Td>
          {fromDate(position.publicationDate)?.format(DATE_FORMAT)}
        </Table.Td>
        <Table.Td>
          <DateTime showLocal value={fromDateTime(position.materialDeadline)} />
        </Table.Td>
        <Table.Td>
          {(position.formatSize)}
        </Table.Td>
        <Table.Td>
          {(position.productionSize)}
        </Table.Td>
        <Table.Td>
          {t(`OPTION_${position.color}`)}
        </Table.Td>
        {isAmountShown && (
          <Table.Td>
            {position.positionGroup ? '-' : getSwissAmountFormat(campaign.currency).format(position.amountNet2)}
          </Table.Td>
        )}
      </Table.Tr>
      {position.info && (
        <Table.AdditionalRow
          title={t('serviceDashboard:NOTE_POSITION')}
          text={position.info}
          dataTestId="print-position-comment"
        />
      )}
      {campaign.hasPermission && position.internalComment && (
        <Table.AdditionalRow
          title={t('serviceDashboard:INTERNAL_COMMENT')}
          text={position.internalComment}
          dataTestId="print-position-internal-comment"
        />
      )}
      {position.isChiffrePosition && (
        <Table.AdditionalRow
          key={`chiffre${position.id}`}
          title={t('serviceDashboard:CHIFFRE')}
          text={position.chiffreNumber}
          dataTestId="chiffre-number-comment"
        />
      )}
    </Table.Tbody>
  );
};

export default React.memo(PrintPositionRow);
