import React from 'react';
import { CampaignDto } from '@adnz/api-ws-salesforce';
import styled from 'styled-components';
import { getSwissAmountFormat } from 'src/constants';
import Container from '../components/Container';

const StyledContainer = styled(Container)`
  & div:first-child {
    font-weight: bold;
  }
`;

const Body:React.FC<{ campaign: CampaignDto }> = ({ campaign }) => {
  const net2 = getSwissAmountFormat(campaign.currency).format(campaign.amountNet2 || 0);
  const net4 = getSwissAmountFormat(campaign.currency).format(campaign.amountNet4 || 0);
  return (
    <StyledContainer>
      {
        campaign.showAmount
        && (
          <>
            <div>
              N2&nbsp;
              {net2}
            </div>
            {!!campaign.amountNet4 && (
            <div>
              N4&nbsp;
              {net4}
            </div>
            )}
          </>
        )
      }
    </StyledContainer>
  );
};

const Footer: React.FC = () => (
  <Container />
);

export default {
  Body,
  Footer,
};
