import styled from 'styled-components';
import Colors from 'src/theme/Colors';
import Media from 'src/theme/Media';
import {
  Container,
} from 'styled-bootstrap-grid';
import Box from './components/Box';

export const StatusRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${Colors['white-two']};
  min-height: 70px;
  align-items: center;
  padding: 5px 0;
`;

export const BoxesRow = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  @media ${Media.mdMin} {
    flex-wrap: nowrap;
    justify-content: center;
  }
`;

export const OrderNumber = styled.span`
  color: ${Colors['dark-sky-blue']};
  font-family: Roboto, sans-serif;
  font-size: 10px;
  opacity: 0.9;
`;

export const CampaignName = styled.div`
  font-family: Roboto, sans-serif;
  color: ${Colors['greyish-brown']};
  font-size: 20px;
`;

export const StyledBox = styled(Box)`
  width: 100%;
  @media ${Media.mlMin} {
    width: 50%;
  }
  @media ${Media.xsMin} {
    width: calc(100% / 3);
  }
  @media ${Media.smMin} {
    width: 25%;
  }
  @media ${Media.mdMin} {
    width: auto;
    min-width: 16.6%;
  }
`;

export const CampaignNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media ${Media.smMax} {
    margin-bottom: 5px;
  }
`;

export const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  & + & {
    margin-left: 40px;
  }
`;

export const DatesWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

export const DateLabel = styled.div`
  font-size: 11px;
  color: ${Colors['very-light-pink-five']};

`;

export const DateValue = styled.div`
  font-size: 12px;
  color: ${Colors['greyish-brown']};
`;

export const DateAndControlsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  @media ${Media.smMax} {
    flex-wrap: wrap;
    flex-direction: row-reverse;
    width: 100%;
  }
`;

export const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  @media ${Media.smMax} {
    margin-right: 40px;
    margin: 5px 40px 5px 0;
  }
  @media ${Media.xsMin} {
    align-items: center;
    justify-content: space-between;
  }
`;

export const TitleRowContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  padding: 15px;
  @media ${Media.mdMin} {
    flex-wrap: nowrap;
  }
  @media ${Media.smMax} {
    flex-direction: column;
    align-items: flex-start;
  }
  &:before,
  &:after {
    content: none !important;
  }
`;
