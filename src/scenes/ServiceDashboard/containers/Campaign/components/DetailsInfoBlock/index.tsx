import React, { useContext } from 'react';
import { PrivateRoute, Roles } from '@adnz/use-auth';
import { Icons } from '@adnz/ui';
import { useTranslation } from 'react-i18next';
import { DATE_FORMAT } from 'src/constants';
import { fromDateTime } from '@adnz/api-ws-salesforce';
import { CampaignToolContext } from 'src/scenes/ServiceDashboard/containers/Campaign/context';
import { Container } from 'styled-bootstrap-grid';
import { CampaignLabels } from 'src/components/AgencyCampaignNameCell';
import Customer from './boxes/Customer';
import Agency from './boxes/Agency';
import Broker from './boxes/Broker';
import SalesContact from './boxes/SalesContact';
import Billing from './boxes/Billing';
import Revenue from './boxes/Revenue';
import {
  BoxesRow,
  CampaignName,
  CampaignNameContainer,
  DateAndControlsContainer,
  DateLabel,
  DatesWrapper,
  DateValue,
  DateWrapper,
  OrderNumber,
  StatusRow,
  StyledBox,
  TitleRowContainer,
} from './styles';

const DetailsInfoBlock:React.FC<{ isPaymentSucceeded: boolean | undefined }> = ({ isPaymentSucceeded = true }) => {
  const { state: { campaign } } = useContext(CampaignToolContext);
  const [t] = useTranslation(['translation', 'common', 'serviceDashboard']);
  if (!campaign) return null;
  const campaignLabel = `STAGE_${campaign.stage}`.toUpperCase();

  return (
    <div css="background: #fff; position: relative;">
      <StatusRow>
        <TitleRowContainer>
          <CampaignNameContainer>
            <div data-testid="campaign-field" css="display: flex;align-items: center;margin-bottom: 5px;">
              <OrderNumber>{campaign.internalOrderNumber}</OrderNumber>
              <CampaignLabels
                campaign={campaign}
                wasPaymentSuccessful={isPaymentSucceeded}
                campaignLabel={campaignLabel}
                css="margin-left: 10px"
              />
            </div>
            <div css="display: flex;justify-content: space-between;align-items: center; padding-right: 15px;">
              <CampaignName>
                {campaign.campaignName}
              </CampaignName>
            </div>
          </CampaignNameContainer>
          <DateAndControlsContainer>
            <DatesWrapper>
              <DateWrapper>
                <DateLabel>{t('serviceDashboard:SELF_BOOKING_START_DATE')}</DateLabel>
                <DateValue>{fromDateTime(campaign.startDate)?.format(DATE_FORMAT)}</DateValue>
              </DateWrapper>
              <DateWrapper>
                <DateLabel>{t('serviceDashboard:SELF_BOOKING_END_DATE')}</DateLabel>
                <DateValue>{fromDateTime(campaign.endDate)?.format(DATE_FORMAT)}</DateValue>
              </DateWrapper>
            </DatesWrapper>
          </DateAndControlsContainer>
        </TitleRowContainer>
      </StatusRow>
      <Container id="boxes-row-campaigns">
        <BoxesRow>
          {
              !!campaign.advertiserAccount
              && (
                <StyledBox
                  icon={(
                    <Icons.Customer size={26} />
                  )}
                  title={t('serviceDashboard:CUSTOMER')}
                  body={<Customer.Body campaign={campaign} />}
                  footer={<Customer.Footer campaign={campaign} />}
                />
              )
            }
          {
              !!campaign.agencyAccount
              && (
                <StyledBox
                  icon={(
                    <Icons.Location />
                  )}
                  title={t('serviceDashboard:AGENCY')}
                  body={<Agency.Body campaign={campaign} />}
                  footer={<Agency.Footer campaign={campaign} />}
                />
              )
            }
          {
              !!campaign.brokerAccount
              && (
                <StyledBox
                  icon={(
                    <Icons.Bag />
                  )}
                  title={t('serviceDashboard:BROKER')}
                  body={<Broker.Body campaign={campaign} />}
                  footer={<Broker.Footer campaign={campaign} />}
                />
              )
            }
          {
              !!campaign.ownerContact
              && (
                <StyledBox
                  icon={(
                    <Icons.PhoneBook />
                  )}
                  title={t('serviceDashboard:SALES_CONTACT')}
                  body={<SalesContact.Body campaign={campaign} />}
                  footer={<SalesContact.Footer />}
                />
              )
            }
          <PrivateRoute
            roles={Roles.ADMIN_INVOICE}
          >
            {!!campaign.payoutAccount && (
              <StyledBox
                icon={(
                  <Icons.Billing />
                    )}
                title={t('serviceDashboard:BILLING')}
                body={<Billing.Body campaign={campaign} />}
                footer={<Billing.Footer campaign={campaign} />}
              />
            )}
          </PrivateRoute>
          {
              !campaign.selfBooked && !!campaign.showAmount && (
                <StyledBox
                  icon={(
                    <Icons.GetMoney />
                  )}
                  title={t('serviceDashboard:REVENUE_NET')}
                  body={<Revenue.Body campaign={campaign} />}
                  footer={<Revenue.Footer />}
                />
              )
            }
        </BoxesRow>
      </Container>
    </div>
  );
};

export default DetailsInfoBlock;
