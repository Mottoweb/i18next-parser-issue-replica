import React, { useState } from 'react';
import { useRequest } from '@adnz/use-request';
import { Button, ButtonGroup } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import SectionTitle from 'src/components/SectionTitle';
import Colors from 'src/theme/Colors';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import { EntityType, getActivities } from '@adnz/api-ws-activity';
import TechnicalActivity from './TechnicalActivity';

const TechnicalActivities:React.FC<{ campaign: CampaignDto, limit?: number }> = ({
  campaign: {
    campaignId,
  },
  limit = 5,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const [show, setShow] = useState<boolean>(false);
  const [{ items: technicalActivities }] = useRequest({
    apiMethod: getActivities,
    debounce: 500,
    defaultData: { items: [] },
    parameters: [{
      entityId: campaignId, entityType: EntityType.CAMPAIGN_TECHNICAL, sort: 'creationDate', order: 'DESC',
    }],
  });

  return (
    <>
      <SectionTitle>{t('serviceDashboard:TECHNICAL_ACTIVITIES')}</SectionTitle>
      <div id="technical-activities-container">
        <>
          { technicalActivities.slice(0, show ? technicalActivities.length : limit).map((activity) => (
            <TechnicalActivity key={activity.id} activity={activity} />
          ))}
          {!technicalActivities.length && (
          <span css={`color: ${Colors['brown-grey-two']}`}>
            {t('serviceDashboard:THERE_ARE_NO_ENTRIES')}
          </span>
          )}
        </>
        {technicalActivities.length > limit && (
          <ButtonGroup align="right" spacer="top">
            <Button theme="create-secondary" onClick={() => setShow((s) => !s)}>
              {show ? t('serviceDashboard:SHOW_LESS') : t('serviceDashboard:SHOW_MORE')}
            </Button>
          </ButtonGroup>
        )}
      </div>
    </>
  );
};

export default TechnicalActivities;
