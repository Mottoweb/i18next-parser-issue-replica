import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'styled-bootstrap-grid';
import { Roles, PrivateRoute } from '@adnz/use-auth';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, PageHeader } from '@adnz/ui';
import SectionTitle from 'src/components/SectionTitle';
import { useHistory } from 'react-router-dom';
import Campaigns from './containers/Campaigns';
import ScreenshotBox from './containers/Screenshots';
import Documents from './containers/Documents';
import Statistics from './containers/Statistics';
import News from './containers/News';
import CompanySelect from '../CompanySelect';

const Dashboard = () => {
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  const history = useHistory();
  return (
    <>
      <Statistics />
      <PageHeader title={t('serviceDashboard:DASHBOARD')}>
        <PrivateRoute
          roles={Roles.ADMIN}
          component={CompanySelect}
        />
      </PageHeader>
      <Container>
        <News />
        <Row>
          <Col md={12}>
            <SectionTitle>{t('serviceDashboard:RUNNING_CAMPAIGNS')}</SectionTitle>
            <Row id="running-campaigns-table" className="table-row">
              <Campaigns type="RUNNING" />
            </Row>
            <ButtonGroup align="right" spacer="top">
              <Button
                theme="create-secondary"
                onClick={() => history.push('/buy-side/campaigns/RUNNING')}
              >
                {t('serviceDashboard:ALL_RUNNING')}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <SectionTitle>{t('serviceDashboard:BOOKED_CAMPAIGNS')}</SectionTitle>
            <Row id="booked-campaigns-table" className="table-row">
              <Campaigns type="BOOKED" />
            </Row>
            <ButtonGroup align="right" spacer="top">
              <Button
                onClick={() => history.push('/buy-side/campaigns/BOOKED')}
                theme="create-secondary"
              >
                {t('serviceDashboard:ALL_BOOKED')}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <SectionTitle>{t('serviceDashboard:PENDING_OFFERS')}</SectionTitle>
            <Row id="pending-offers-table" className="table-row">
              <Campaigns type="OFFERED" />
            </Row>
            <ButtonGroup align="right" spacer="top">
              <Button
                onClick={() => history.push('/buy-side/campaigns/OFFERED')}
                theme="create-secondary"
              >
                {t('serviceDashboard:ALL_OFFERED')}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <SectionTitle>{t('serviceDashboard:ARCHIVED_CAMPAIGNS')}</SectionTitle>
            <Row id="archived-campaigns-table" className="table-row">
              <Campaigns type="ARCHIVED" />
            </Row>
            <ButtonGroup align="right" spacer="top">
              <Button
                onClick={() => history.push('/buy-side/campaigns/ARCHIVED')}
                theme="create-secondary"
              >
                {t('serviceDashboard:ALL_ARCHIVED')}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <ScreenshotBox />
        <Documents />
      </Container>
    </>
  );
};

export default Dashboard;
