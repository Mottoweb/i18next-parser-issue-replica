import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Container } from 'styled-bootstrap-grid';
import { useTranslation } from 'react-i18next';
import {
  CAMPAIGN_TYPES,
} from 'src/constants';
import SectionTitle from 'src/components/SectionTitle';
import CampaignHistory from 'src/scenes/ServiceDashboard/containers/SelfBookingHistory/CampaignHistory';
import PositionHistory from 'src/scenes/ServiceDashboard/containers/SelfBookingHistory/PositionHistory';
import { Button } from '@adnz/ui';

export interface ISelfBookingHistory {
  campaignId: string
  renderUpperMenu?: () => React.ReactNode
}

const SelfBookingHistory: React.FC<ISelfBookingHistory> = ({
  campaignId,
  renderUpperMenu,
}) => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  return (
    <>
      {renderUpperMenu && renderUpperMenu()}
      <Container>
        <SectionTitle>
          <span>{t('serviceDashboard:HISTORY')}</span>
          <Route
            path={`/buy-side/campaigns/:type(${CAMPAIGN_TYPES.join('|')})/:campaignId(\\d+)/sb-history`}
            render={({ match }) => (
              <div>
                <Button
                  theme="create-secondary"
                  onClick={() => history.push(`/buy-side/campaigns/${match.params.type}/${match.params.campaignId}`)}
                >
                  {t('serviceDashboard:BACK_TO_CAMPAIGN')}
                </Button>
              </div>
            )}
          />
        </SectionTitle>
        <CampaignHistory campaignId={campaignId} />
        <SectionTitle>
          <span>{t('serviceDashboard:POSITION_HISTORY')}</span>
        </SectionTitle>
        <PositionHistory campaignId={campaignId} />
      </Container>
    </>
  );
};

export default SelfBookingHistory;
